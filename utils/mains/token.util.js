const jwt = require('jsonwebtoken');
const { log } = require('@main_util/logger.util');
const { selEncrypt, selDecrypt, generateUniqueToken }  = require('@main_util/security.util');
const Token = require(MODELS + 'Token.schema');


const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

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

const  generateToken = async (id) => {
    let token = null;

    if(process.env.TOKEN_SETTER === 'jwt') {
        token = jwt.sign(
            { id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
    } else if (process.env.TOKEN_SETTER === 'local_self') {
        // generate token
        const genToken = generateUniqueToken();

        // insert into db
        const save = await createOrUpdateToken(id, genToken);

        token = save ? genToken : null ;
    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        // generate token
        const genToken = generateUniqueToken();

        // insert into db
        const save = await createOrUpdateToken(id, genToken);

        token = save ? genToken : null ;
    }

    return token;
}

const createOrUpdateToken = async (id, token) => {
    const savedToken = await Token.findOneAndUpdate(
        { user_id: id },
        {
            token,
            expire_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour TTL
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    return savedToken;
}

const deleteToken = async (id) => {
    const result = await Token.deleteOne({ user_id: id });

    return result.deletedCount > 0;
}

module.exports = {
    extractToken,
    setToken,
    deleteToken,
};
