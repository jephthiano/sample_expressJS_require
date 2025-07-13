const { findSingleValue } = require('@database/mongo/general.db');
const User = require('@model/User.schema');
const { selEncrypt }  = require('@main_util/security.util');

const findUserByID = async (userId) => {
    return await User.findOne({ _id: userId});
}

const findUserByEmailOrPhone = async(receiving_medium) => {
    const enc_receiving_medium = selEncrypt(receiving_medium, 'email_phone');

    return await User.findOne(
            { $or: [{ mobile_number: enc_receiving_medium }, { email: enc_receiving_medium }] }
        );
}

const findEmailMobileNumberUsername = async(email, mobile_number, username) => {
    return Promise.all([
            findSingleValue('User', 'email', selEncrypt(email, 'email'), 'email'),
            findSingleValue('User', 'mobile_number', selEncrypt(mobile_number, 'mobile_number'), 'mobile_number'),
            findSingleValue('User', 'username', selEncrypt(username, 'username'), 'username')
        ]);
}

const findUserSingleValue = async (model, checkField, checkValue, returnField) => {
    return await findSingleValue(model, checkField, checkValue, returnField);
}

const findUserSingleValuebyEncField = async (model, checkField, checkValue, returnField) => {
    checkField = selEncrypt(checkValue, checkField);
    return await findSingleValue(model, checkField, checkValue, returnField);
}

module.exports = {
    findUserByID,
    findUserByEmailOrPhone,
    findEmailMobileNumberUsername,
    findUserSingleValue,
    findUserSingleValuebyEncField
};