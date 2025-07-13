const jwt = require('jsonwebtoken');

const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY); // default to 1 hour
const jwtSecret = process.env.JWT_SECRET_KEY;


const createJwtToken = async (userId) => {
    const token = jwt.sign(
        { userId },
        jwtSecret,
        { expiresIn: parseInt(tokenExpiry) }// in seconds
    );

    return token ?? null;
}

const renewJwtToken = async (token) => {
    const decoded = jwt.verify(token, jwtSecret,);
    const userId = decoded?.id;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = decoded.exp - now;

    return timeLeft <= process.env.THRESHOLD ? createJwtToken(userId) : token;
}


const validateJwtToken = async (token) =>{
    const decoded = jwt.verify(token, jwtSecret,);
        return decoded?.userId ?? null;
}

module.exports = {
    createJwtToken,
    renewJwtToken,
    validateJwtToken,
 }