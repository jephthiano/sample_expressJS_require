const jwt = require('jsonwebtoken');
const Token = require(MODELS + 'Token.schema');
const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { selDecrypt, returnResponse, verifyPassword }  = require(MAIN_UTILS + 'security.util');
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
    try {
        // if it is seadon or cookie
        const token = process.env.TOKEN_TYPE === 'bearer' ? extractToken(req.headers.authorization) : token = selDecrypt(req.cookies._menatreyd, 'token');
        if (!token) return returnResponse(res, { status: false, message: 'Invalid account' });

        // validate with jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        
        // Fetch user details 
        const user = await User.findOne({ _id: decoded.id });
        //if user not found
        if (!user) return returnResponse(res, { status: false, message: 'Invalid account' });
        
        //verify the token
        const Dbtoken = await Token.findOne({
            user_id: user.id,
            expire_at: { $gt: new Date() } // only return if not expired
        });
        
        if(!Dbtoken) return returnResponse(res, { status: false, message: 'Log in expired' });
        
        console.log(await verifyPassword(token, Dbtoken.token));
        //if token is not valid
        if(!await verifyPassword(token, Dbtoken.token)) return returnResponse(res, { status: false, message: 'Invalid login' });

        if (user.status === 'suspended') return returnResponse(res, { status: false, message: 'You have been suspended, contact admin' });
        
        // Attach data to request object
        req.user = user;
        req.token = token;
        
        next(); // Proceed to next middleware
    } catch (err) {
        logError('Token Verification Error', err);
        return returnResponse(res, { status: false, message: 'Error Occurred' });
    }
};

const validateToken = () => {
    
}
module.exports = { tokenValidator };
