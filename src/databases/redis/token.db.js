const { redis } = require('@config/database'); 
 
 const redisGetUserIdByToken = async (token) => {
    const userId = await redis.get(`auth:token:${token}`);

    return userId;
 }

 const redisDeleteToken = async(userId) => {
    const token = await redis.get(`auth:user:${userId}`);
    
    if(token){
        // Delete both keys
        const delToken = await redis.del(`auth:token:${token}`);
        const delUser = await redis.del(`auth:user:${userId}`);
        return delToken > 0 && delUser > 0;
    }

    return false;
 }

 const redisCreateToken = async (userId, newToken) => {
    //delete old token
    const oldToken = await redis.get(`auth:user:${userId}`);
    if (oldToken) await redis.del(`auth:token:${oldToken}`); // delete only token [user will be updated]

    // insert into redis db
    const isUserIdSaved = await redis.set(`auth:user:${userId}`, newToken, 'EX', tokenExpiry);
    const isTokenSaved = await redis.set(`auth:token:${newToken}`, userId, 'EX', tokenExpiry);

    return isUserIdSaved && isTokenSaved;
 }

 const redisRenewToken = async (userId, token) => {
    const renewUserId = await redis.expire(`auth:token:${token}`, tokenExpiry);
    const renewToken = await redis.expire(`auth:user:${userId}`, tokenExpiry);

    return renewUserId && renewToken;
    
 }

 module.exports = {
    redisGetUserIdByToken,
    redisDeleteToken,
    redisCreateToken,
    redisRenewToken.
 }