const jwt = require('jsonwebtoken');
const { log } = require('@main_util/logger.util');
const { selEncrypt, selDecrypt, generateUniqueToken }  = require('@main_util/security.util');
const Token = require('@model/Token.schema');
const { redis } = require('@config/database');


const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');
const tokenExpiry = 60 * 60 * 24; //24 hour TTL

// Extract token from headers (Bearer Token)
const extractToken = (authHeader) => {
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.split(' ')[1] || null;
        return token ? selDecrypt(token, 'token') : null;
    }
    return null;
};

// Generate JWT Token with expiration
const setToken = async (id) => {
    try {
        const token = await generateToken(id);

        if(!token) return null;

        return selEncrypt(token, 'token'); // Encrypt token
    } catch (err) {
        logError("Set Token Error", err);
        return null; // Return null if token generation fails
    }
};

const  generateToken = async (userId) => {
    let token = null;

    if(process.env.TOKEN_SETTER === 'jwt') {
        token = jwt.sign(
            { userId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
    } else if (process.env.TOKEN_SETTER === 'local_self') {
        // generate token
        const genToken = generateUniqueToken();

        // insert into db
        const save = await createOrUpdateToken(userId, genToken);

        token = save ? genToken : null ;
    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        // generate token
        const genToken = generateUniqueToken();

        // insert into redis db
        const save =  await redis.set(`auth:token:${genToken}`, userId, 'EX', tokenExpiry);

        token = save ? genToken : null ;
    }

    return token;
}

const createOrUpdateToken = async (userId, token) => {
    const savedToken = await Token.findOneAndUpdate(
        { user_id: userId },
        {
            token,
            expire_at: new Date(Date.now() + tokenExpiry)
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    return savedToken;
}

const deleteToken = async (userId) => {
    let status = false;
    if (process.env.TOKEN_SETTER === 'local_self') {
        const result = await Token.deleteOne({ user_id: userId });
        status =  result.deletedCount > 0;
    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        status = await redis.del(`auth:token:${token}`);
    }

    return status;

}

module.exports = {
    extractToken,
    setToken,
    deleteToken,
};
