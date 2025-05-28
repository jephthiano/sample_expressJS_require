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
        return returnResponse(res, { status: false, message: 'Invalid account' });
    }
    
    try {
        // validate with jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Fetch user details 
        // ADD WHERE TOKEN = TOKEN
        const user = await User.findOne({ _id: decoded.id });
        
        
        if (!user) {
            return returnResponse(res, { status: false, message: 'Invalid accoun' });
        }
        
        if (user.status === 'suspended') {
            return returnResponse(res, { status: false, message: 'You have been suspended, contact admin' });
        }
        
        // Attach data to request object
        req.user = user;
        req.token = token;
        
        next(); // Proceed to next middleware
    } catch (err) {
        logError('Token Verification Error', err);
        return returnResponse(res, { status: false, message: 'Invalid account' });
    }
};

module.exports = { tokenValidator };
