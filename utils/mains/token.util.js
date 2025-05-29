const jwt = require('jsonwebtoken');
const { log } = require(MAIN_UTILS + 'logger.util');
const { selEncrypt, selDecrypt }  = require(MAIN_UTILS + 'security.util');
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
        const token = jwt.sign(
            { id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // insert into db
        $savedToken = await createOrUpdateToken(id, token);
        
        if(!$savedToken) return null;

        return selEncrypt(token, 'token'); // Encrypt token
    } catch (err) {
        logError("Set Token Error", err);
        return null; // Return null if token generation fails
    }
};


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

module.exports = {
    extractToken,
    setToken,
};
