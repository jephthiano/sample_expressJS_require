const jwt = require('jsonwebtoken');
const { log } = require(MAIN_UTILS + 'logger.util');
const { selEncrypt, selDecrypt }  = require(MAIN_UTILS + 'security.util');
const User = require(MODELS + 'User.schema');


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
        $updatedUser = await User.findByIdAndUpdate(id, { token });
        
        if(!$updatedUser) return null;

        return selEncrypt(token, 'token'); // Encrypt token
    } catch (err) {
        logError("Set Token Error", err);
        return null; // Return null if token generation fails
    }
};

module.exports = {
    extractToken,
    setToken,
};
