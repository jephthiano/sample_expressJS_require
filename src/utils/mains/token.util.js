const jwt = require('jsonwebtoken');
const { log } = require('@main_util/logger.util');
const { selEncrypt, selDecrypt, generateUniqueToken }  = require('@main_util/security.util');
const Token = require('@model/Token.schema');
const { redis } = require('@config/database');


const logError = (type, data) => log(type, data, 'error');
const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY) || 3600; // default to 1 hour


// Generate JWT Token with expiration
const setApiToken = async (id) => {
    try {
        const token = await generateToken(id);

        if(!token) return null;

        return selEncrypt(token, 'token'); // Encrypt token
    } catch (err) {
        logError("Set Token Error", err);
        return null; // Return null if token generation fails
    }
};

const validateApiToken = async (req) => {
    const token = getApiToken(req);
    if (!token) return false;

    let userId = null;

    try {
        const setter = process.env.TOKEN_SETTER;

        if (setter === 'jwt') {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            userId = decoded?.id;

        } else if (setter === 'local_self') {
            const dbToken = await Token.findOne({
                token,
                expire_at: { $gt: new Date() }
            });

            userId = dbToken?.user_id;

        } else if (setter === 'redis_self') {
            userId = await redis.get(`auth:token:${token}`);
        } else {
            throw new Error(`Unsupported TOKEN_SETTER: ${setter}`);
        }

        if (userId) {
            await autoRenewTime(userId, token); // Consider making it await if it's async
            return userId;
        }

        return false;

    } catch (err) {
        logError("Token Validation Error", err);
        return false;
    }
};


const deleteApiToken = async (req) => {
    let status = false;

    try {
        if (process.env.TOKEN_SETTER === 'local_self') {
            const userId = req.params?.id ?? null ;

            if(userId){
                const result = await Token.deleteOne({ user_id: userId });
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
    } catch (err) {
        logError("Token Deletion Error", err);
        return false;
    }

    return status;
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
    let token = null;
    
    try{
        if(process.env.TOKEN_SETTER === 'jwt') {
            token = jwt.sign(
                { userId },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' } // Token expires in 1 hour
            );
        } else if (process.env.TOKEN_SETTER === 'local_self') {
            token = await createLocalDBToken(userId) ?? null ;
        } else if (process.env.TOKEN_SETTER === 'redis_self') {
            token = await createRedisToken(userId) ?? null ;
        }
    } catch (err) {
        logError("Token Generation Error", err);
        return null;
    }

    return token;
}

const createLocalDBToken = async (userId) => {
    // generate token
    const newToken = generateUniqueToken();
    try{
        const savedToken = await Token.findOneAndUpdate(
            { user_id: userId },
            {
                token: newToken,
                expire_at: new Date(Date.now() + tokenExpiry)
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
    } catch (err) {
        logError("Local DB Token Creation Error", err);
        return null;
    }

    return newToken;
}

const createRedisToken =  async (userId) => {
    const newToken = generateUniqueToken();

    try{
        //delete old token
        const oldToken = await redis.get(`auth:user:${userId}`);
        if (oldToken) await redis.del(`auth:token:${oldToken}`);

        // insert into redis db
        await redis.set(`auth:user:${userId}`, newToken, 'EX', tokenExpiry);
        await redis.set(`auth:token:${newToken}`, userId, 'EX', tokenExpiry);
        
        return newToken;
    } catch (err) {
        logError("Redis Token Creation Error", err);
        return null;
    }

}

const autoRenewTime = async(userID, token) => {
    if (process.env.TOKEN_SETTER === 'local_self') {
        try{

            const savedToken = await Token.findOneAndUpdate(
            { user_id: userId },
            {
                expire_at: new Date(Date.now() + tokenExpiry)
            },
        );
            return true
        } catch (err) {
            logError("Local DB Token Auto Renewal Error", err);
            return false;
        }
    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        try{
            // ⏳ Renew TTL
            await redis.expire(`auth:token:${token}`, tokenExpiry);
            await redis.expire(`auth:user:${userId}`, tokenExpiry);
        
            return true
        } catch (err) {
            logError("Redis Token Auto Renewal Error", err);
            return false;
        }
    }
}

module.exports = {
    setApiToken,
    validateApiToken,
    deleteApiToken,
};