const jwt = require('jsonwebtoken');
const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY) || 3600; // default to 1 hour


const createJwtToken = async (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: parseInt(tokenExpiry) }// in seconds
    );

    return token ?? null;
}

const renewJwtToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded?.id;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = decoded.exp - now;

    return timeLeft <= process.env.THRESHOLD ? generateToken(userId) : token;
}


const validateJwtToken = async (token) =>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded?.userId ?? null;
}

module.exports = {
    createJwtToken,
    renewJwtToken,
    validateJwtToken,
 }