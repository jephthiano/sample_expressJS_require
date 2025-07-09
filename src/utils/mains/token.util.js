const jwt = require('jsonwebtoken');
const { selEncrypt, selDecrypt, generateUniqueToken }  = require('@main_util/security.util');
const { redis } = require('@config/database');
const { triggerError} = require('@core_util/handler.util');
const { findUnexpiredToken, deleteToken, updateOrCeateToken, updateExpireTime } = require('@database/mongo/otp.db');


const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY) || 3600; // default to 1 hour

// Generate Token with expiration
const setApiToken = async (id) => {
    const token = await generateToken(id);

    if(!token) return null;

    return selEncrypt(token, 'token'); // Encrypt token
};

const validateApiToken = async (req) => {
    const token = getApiToken(req);
    if (!token) return false;
    
    let userId = null;

    const setter = process.env.TOKEN_SETTER;

    if (setter === 'jwt') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = decoded?.id;

    } else if (setter === 'local_self') {
        const dbToken = await findUnexpiredToken(token);

        userId = dbToken?.user_id;

    } else if (setter === 'redis_self') {
        userId = await redis.get(`auth:token:${token}`);
    } else {
        triggerError(`Unsupported TOKEN_SETTER: ${setter}`, [], 400);
    }

    if (userId) {
        const newToken = await autoRenewTokenTime(userId, token); // gonna need if token will be changing at every request
        return userId;
    }

    return false;
    
};

const deleteApiToken = async (req) => {
    let status = false;

    if (process.env.TOKEN_SETTER === 'jwt') {

        status = true;
    } else if (process.env.TOKEN_SETTER === 'local_self') {
        
        const userId = req.params?.id ?? null ;

        if(userId){
            const result = await deleteToken(userId)
            status =  result.deletedCount > 0;
        }

    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        // Get the token associated with the user
        const token = await redis.get(`auth:user:${userId}`);
        if(token){
            // Delete both keys
            const delToken = await redis.del(`auth:token:${token}`);
            const delUser = await redis.del(`auth:user:${userId}`);
            status = delToken > 0 && delUser > 0;
        }

    }

    return status;
}

const setCurrentToken = (req) => {
    const token = getApiToken(req);

    return token ? selEncrypt(token, 'token') : token;
}



//get the token
const getApiToken = (req) => {
    const token = process.env.TOKEN_TYPE === 'bearer' 
                    ? extractToken(req.headers.authorization) 
                    : selDecrypt(req.cookies._menatreyd, 'token');

    return token ?? null;
}

// Extract token from headers (Bearer Token)
const extractToken = (authHeader) => {
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.split(' ')[1] || null;
        return token ? selDecrypt(token, 'token') : null;
    }
    return null;
};

// generate token and save the token
const  generateToken = async (userId) => {
        const methods = {
            jwt: () => createJwtToken(userId),
            local_self: () => createLocalDBToken(userId),
            redis_self: () => createRedisToken(userId),
        };

        const method = process.env.TOKEN_SETTER;
        return methods[method] ? await method[method]() : null;
}


const autoRenewTokenTime = async(userId, token) => {
    const methods = {
        jwt: () => renewJwtToken(token),
        local_self: () => renewLocalDBToken(userId),
        redis_self: () => renewRedisToken(userId),
    };

    const method = process.env.TOKEN_SETTER;
    return methods[method] ? await method[method]() : null;
}

const createJwtToken = async (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: parseInt(process.env.JWT_EXPIRY) }// in seconds
    );
}

const createLocalDBToken = async (userId) => {
    // generate token
    const newToken = generateUniqueToken();
    const save = await updateOrCeateToken(userId, newToken);

    return save ? newToken : null;
    
}

const createRedisToken =  async (userId) => {
    const newToken = generateUniqueToken();

    //delete old token
    const oldToken = await redis.get(`auth:user:${userId}`);
    if (oldToken) await redis.del(`auth:token:${oldToken}`);

    // insert into redis db
    const isUserIdSaved = await redis.set(`auth:user:${userId}`, newToken, 'EX', tokenExpiry);
    const isTokenSaved = await redis.set(`auth:token:${newToken}`, userId, 'EX', tokenExpiry);
    
    return isUserIdSaved && isTokenSaved ? newToken : null;
}

const renewJwtToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded?.id;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = decoded.exp - now;

    return timeLeft <= process.env.THRESHOLD ? generateToken(userId) : token;
}

const renewLocalDBToken = async (userId) => {
    const savedToken = await updateExpireTime(userId);
    return savedToken ?? null
}

const renewRedisToken = async (userId) => {
    // Renew TTL
    const renewUserId = await redis.expire(`auth:token:${token}`, tokenExpiry);
    const renewToken = await redis.expire(`auth:user:${userId}`, tokenExpiry);

    return !!(renewUserId && renewToken);
}

module.exports = {
    setApiToken,
    validateApiToken,
    deleteApiToken,
    setCurrentToken,
};