const { validateApiToken } = require('#main_util/token.util');
const { handleException, triggerError} = require('#core_util/handler.util');
const { findUserByID } = require('#database/mongo/user.db');


// Middleware to verify token and attach user data to `req`
const tokenValidator = async (req, res, next) => {
    try {
        const userId = await validateApiToken(req);
        if(!userId) triggerError('Invalid request', [], 401);
  
        // Fetch user details 
        const user = await findUserByID(userId);
        //if user not found
        if (!user) triggerError('Invalid account', [], 401);
        
        if (user.status === 'suspended') triggerError('You have been suspended, contact admin', [], 401);
        
        // Attach data to request object
        req.user = user;
        
        next(); // Proceed to next middleware
    } catch (err) {
        handleException(res, err);
    }
};
module.exports = { tokenValidator };
