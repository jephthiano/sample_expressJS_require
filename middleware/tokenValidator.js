const jwt = require('jsonwebtoken');
const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { selDecrypt, returnResponse }  = require(MAIN_UTILS + 'security.util');
const { extractToken } = require(MAIN_UTILS + 'token.util');

// Utility function to log info
const logInfo = (type, data) => {
    log(type, data, 'info');
};

// Utility function to log errors
const logError = (type, data) => {
    log(type, data, 'error');
};

// Middleware to verify token and attach user data to `req`
const tokenValidator = async (req, res, next) => {
    token = process.env.TOKEN_TYPE === 'bearer' ? extractToken(req.headers.authorization) : token = selDecrypt(req.cookies._menatreyd, 'token');

    if (!token) {
        return returnResponse(res, req, { status: 'invalid', message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch user details
        const user = await User.findOne({ unique_id: decoded.id });

        if (!user) {huj
            return returnResponse(res, req, { status: 'invalid', message: 'User not found' });
        }

        if (user.status === 'suspended') {
            return returnResponse(res, req, { status: 'unauthorized', message: 'You have been suspended, contact admin' });
        }

        // Attach user data to request object
        req.user = req.data;

        next(); // Proceed to next middleware
    } catch (err) {
        logError('Token Verification Error', err);
        return returnResponse(res, req, { status: 'invalid', message: 'Invalid token' });
    }
};

module.exports = { tokenValidator };
