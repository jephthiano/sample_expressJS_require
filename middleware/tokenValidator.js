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
        const token = getToken(req);
        if (!token) return returnResponse(res, { status: false, message: 'Invalid account' });

        const userId = await validateToken(token);
        if(!userId) return returnResponse(res, { status: false, message: 'Invalid login' });

        
        // Fetch user details 
        const user = await User.findOne({ _id: userId});
        //if user not found
        if (!user) return returnResponse(res, { status: false, message: 'Invalid account' });
        
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

const getToken = (req) => {
    return process.env.TOKEN_TYPE === 'bearer' ? extractToken(req.headers.authorization) : token = selDecrypt(req.cookies._menatreyd, 'token');
}

const validateToken = async (token) => {
    let response = false;

    if(process.env.TOKEN_SETTER === 'jwt') {
        // validate with jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        response = decoded?.id ?? null;
    } else if (process.env.TOKEN_SETTER === 'local_self') {
        //verify the token
        const Dbtoken = await Token.findOne({
            token,
            expire_at: { $gt: new Date() } // only return if not expired
        });

        response = Dbtoken?.user_id ?? null;
    } else if (process.env.TOKEN_SETTER === 'redis_self') {
        //verify the token
        const Dbtoken = await Token.findOne({
            token,
            expire_at: { $gt: new Date() } // only return if not expired
        });

        response = Dbtoken?.user_id ?? null;
    }
    return response;
}
module.exports = { tokenValidator };
