const Token = require('#model/Token.schema');
const { selEncrypt }  = require('#main_util/security.util');
const { generateUniqueToken }  = require('#main_util/security.util');

const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY);

const dbFindUnexpiredToken = async (token)=> {
    token = selEncrypt(token, 'token');
    const user = await Token.findOne({ token, expire_at: { $gt: new Date() } });
    return user?.user_id ?? null;
}

const dbUpdateOrCeateToken = async (userId) => {
    const token = generateUniqueToken();

    const result = await Token.findOneAndUpdate(
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

    return result ? token : null;
}

const DbRenewToken = async (userId) => {
    const renew = await Token.findOneAndUpdate(
        { user_id: userId },
        {
            expire_at: new Date(Date.now() + tokenExpiry)
        },
    );

    return renew ? true : false;
}

const dbDeleteToken = async (token) => {
    const encryptedToken = selEncrypt(token, 'token');
    const result = await Token.deleteOne({ token: encryptedToken });
    
    return result.deletedCount > 0;
}


module.exports = {
    dbFindUnexpiredToken,
    dbUpdateOrCeateToken,
    DbRenewToken,
    dbDeleteToken,
};