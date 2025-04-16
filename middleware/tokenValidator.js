const jwt = require('jsonwebtoken');
const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { selDecrypt, returnResponse }  = require(MAIN_UTILS + 'security.util');

// Utility function to log info
const logInfo = (type, data) => {
    log(type, data, 'info');
};

// Utility function to log errors
const logError = (type, data) => {
    log(type, data, 'error');
};

// Extract token from headers (Bearer Token)
const extractToken = (authHeader) => {
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        return authHeader.split(' ')[1] || null;
    }
    return null;
};

// Middleware to verify token and attach user data to `req`
const tokenValidator = async (req, res, next) => {
    let token = '';

    // Retrieve token from cookies or authorization header
    if (req.cookies._menatreyd) {
        token = selDecrypt(req.cookies._menatreyd, 'token');
    } else if (req.headers.authorization) {
        token = extractToken(req.headers.authorization);
    }

    if (!token) {
        return returnResponse(res, req, { status: 'invalid', message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch user details
        const userData = await User.findOne({ unique_id: decoded.id });

        if (!userData) {
            return returnResponse(res, req, { status: 'invalid', message: 'User not found' });
        }

        if (userData.status === 'suspended') {
            return returnResponse(res, req, { status: 'unauthorized', message: 'You have been suspended, contact admin' });
        }

        // Attach user data to request object
        req.data = req.data || {};
        req.data.token = token;
        req.data.userData = userData;

        next(); // Proceed to next middleware
    } catch (err) {
        logError('Token Verification Error', err);
        return returnResponse(res, req, { status: 'invalid', message: 'Invalid token' });
    }
};

module.exports = { tokenValidator };
