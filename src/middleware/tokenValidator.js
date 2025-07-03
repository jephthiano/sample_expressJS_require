const User = require('@model/User.schema');
const { log } = require('@main_util/logger.util');
const { returnResponse }  = require('@main_util/security.util');
const { validateApiToken } = require('@main_util/token.util');

const logError = (type, data) => log(type, data, 'error');

// Middleware to verify token and attach user data to `req`
const tokenValidator = async (req, res, next) => {
    try {
        const userId = await validateApiToken(token);
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
module.exports = { tokenValidator };
