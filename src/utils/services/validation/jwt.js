const jwt = require('jsonwebtoken');
const { getEnvorThrow } = require('#main_util/general.util');

const TOKEN_EXPIRY = parseInt(getEnvorThrow('TOKEN_EXPIRY'));
const JWT_SECRET_KEY = getEnvorThrow('JWT_SECRET_KEY');
const THRESHOLD = parseInt(getEnvorThrow('THRESHOLD'));

const createJwtToken = async (userId) => {
    const token = jwt.sign(
        { userId },
        JWT_SECRET_KEY,
        { expiresIn: parseInt(TOKEN_EXPIRY) }// in seconds
    );

    return token ?? null;
}

const renewJwtToken = async (token) => {
    const decoded = jwt.verify(token, JWT_SECRET_KEY,);
    const userId = decoded?.id;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = decoded.exp - now;

    return timeLeft <= THRESHOLD ? createJwtToken(userId) : token;
}


const validateJwtToken = async (token) =>{
    const decoded = jwt.verify(token, JWT_SECRET_KEY,);
        return decoded?.userId ?? null;
}

module.exports = {
    createJwtToken,
    renewJwtToken,
    validateJwtToken,
 }