const { findSingleValue } = require('@database/mongo/general.db');
const User = require('@model/User.schema');
const { selEncrypt, selDecrypt }  = require('@main_util/security.util');
const { createUserDTO, updatePasswordDTO } = require('@dto/user.dto');

const findUserByID = async (userId) => {
    return await User.findOne({ _id: userId});
}

const findUserByEmailOrPhone = async(receiving_medium) => {
    const enc_receiving_medium = selEncrypt(receiving_medium.toLowerCase(), 'email_phone');

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

const createUserAccount = async(data) => {
    const userData = createUserDTO(data);
    return await User.create(userData);
}

const resetUserPaswword = async(data) => {
    
        data = updatePasswordDTO(data);
        
        const { password, receiving_medium } = data;
        const encMedium = selEncrypt(receiving_medium, 'email_phone');
        
        const user =  await User.findOneAndUpdate(
            {$or: [{ mobile_number: encMedium }, { email: encMedium }]},
            { password },
            { new: true }
        )  
        
        if(!user) return null;

        return {
            email: selDecrypt(user.email, 'email'),
            first_name: selDecrypt(user.first_name, 'first_name'),
        };
}

module.exports = {
    findUserByID,
    findUserByEmailOrPhone,
    findEmailMobileNumberUsername,
    findUserSingleValue,
    findUserSingleValuebyEncField,
    createUserAccount,
    resetUserPaswword
};