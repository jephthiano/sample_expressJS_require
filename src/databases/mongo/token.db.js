const Token = require('@model/Token.schema');
const { selEncrypt }  = require('@main_util/security.util');

const findUnexpiredToken = async (token)=> {
    token = selEncrypt(token, 'token');
    const user = await Token.findOne({ token, expire_at: { $gt: new Date() } });
    return user?.user_id ?? null;
}

const updateOrCeateToken = async (userId, token) => {
    return await Token.findOneAndUpdate(
            { user_id: userId },
            {
                token,
                expire_at: new Date(Date.now() + tokenExpiry)
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
}

const updateExpireTime = async (userId) => {
    return await Token.findOneAndUpdate(
        { user_id: userId },
        {
            expire_at: new Date(Date.now() + tokenExpiry)
        },
    );
}

const deleteToken = async (userId) => {
    const result = await Token.deleteOne({ user_id: userId });
    return result.deleteCount > 0;
}


module.exports = {
    findUnexpiredToken,
    updateOrCeateToken,
    updateExpireTime,
    deleteToken,
};