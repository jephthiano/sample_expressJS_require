const Token = require('@model/Token.schema');

const findUnexpiredToken = async (token)=> {
    return await Token.findOne({ token, expire_at: { $gt: new Date() } });
}

const deleteToken = async (userId) => {
    return await Token.deleteOne({ user_id: userId });
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


module.exports = {
    findUnexpiredToken,
    deleteToken,
    updateOrCeateToken,
    updateExpireTime,
};