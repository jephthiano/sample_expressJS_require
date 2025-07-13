const jwt = require('jsonwebtoken');
const { generateUniqueToken }  = require('@main_util/security.util');
const { triggerError} = require('@core_util/handler.util');
const { findUnexpiredToken, deleteToken, updateOrCeateToken, updateExpireTime } = require('@database/mongo/token.db');
const { redisGetUserIdByToken, redisDeleteToken, redisCreateToken, redisRenewToken, } = require('@database/redis/token.db');
const { createJwtToken, renewJwtToken, validateJwtToken } = require('@service_util/validation/jwt');

// Generate Token with expiration
const setApiToken = async (id) => {
    const token = await generateToken(id);

    return token ?? null;

};

const validateApiToken = async (req) => {
    const token = getApiToken(req);
    if (!token) return false;
    
    let userId = null;

    const setter = process.env.TOKEN_SETTER;

    if (setter === 'jwt') {
        userId = await validateJwtToken(token);
    } else if (setter === 'local_self') {
        userId = await findUnexpiredToken(token);
    } else if (setter === 'redis_self') {
        userId = await redisGetUserIdByToken(token)
    } else {
        triggerError(`Unsupported TOKEN_SETTER: ${setter}`, [], 400);
    }

    if (userId) {
        const newToken = await autoRenewTokenTime(userId, token); // gonna need  newTokenif token will be changing at every request [or when  close to expre time]
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
        if(userId) status = await deleteToken(userId)

    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        status= await redisDeleteToken($userId);
    }

    return status;
}


//get the token
const getApiToken = (req) => {
    const token = process.env.TOKEN_TYPE === 'bearer' 
                    ? extractToken(req.headers.authorization) 
                    : req.cookies._menatreyd;

    return token ?? null;
}

// Extract token from headers (Bearer Token)
const extractToken = (authHeader) => {
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.split(' ')[1] || null;
        return token ? token : null;
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
        return methods[method] ? await methods[method]() : null;
}


const autoRenewTokenTime = async(userId, token) => {
    const methods = {
        jwt: () => renewJwtToken(token),
        local_self: () => renewLocalDBToken(userId),
        redis_self: () => renewRedisToken(userId, token),
    };

    const method = process.env.TOKEN_SETTER;
    return methods[method] ? await methods[method]() : null;
}

const createLocalDBToken = async (userId) => {
    // generate token
    const newToken = generateUniqueToken();
    const save = await updateOrCeateToken(userId, newToken);

    return save ? newToken : null;
    
}

const createRedisToken =  async (userId) => {
    const newToken = generateUniqueToken();
    const save =  redisCreateToken(userId, newToken);

    return save ? newToken : null;
}

const renewLocalDBToken = async (userId) => {
    const savedToken = await updateExpireTime(userId);
    return savedToken ?? null
}

const renewRedisToken = async (userId, token) => {
    // Renew TTL
    const renew = redisRenewToken(userId, token);

    return !!renew;
}

module.exports = {
    getApiToken,
    setApiToken,
    validateApiToken,
    deleteApiToken,
};