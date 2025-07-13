const { isEmptyObject, isEmptyString }  = require('@main_util/general.util');
const { validateInput }  = require('@main_util/security.util');
const { findUserSingleValuebyEncField, } = require('@database/mongo/user.db');

// Utility function for response formatting
const formatResponse = (errors) => ({
    status: !isEmptyObject(errors),
    data: errors
});

const validateEmailChange = async ({ email }, userData) => {
    let errors = {};

    const emailExists = await findUserSingleValuebyEncField('User', 'email', email, 'email');

    // Validate email
    if (!email || isEmptyString(email)) {
        errors.email = "Email is required";
    } else if (!validateInput(email, 'email')) {
        errors.email = "Invalid email format";
    } else if (emailExists) {
        errors.email = (emailExists === userData.email)
            ? "You cannot use your current email"
            : "Email is taken by another user";
    }

    return formatResponse(errors);
};

const validateUsernameChange = async ({ username }, userData) => {
    let errors = {};

    const usernameExists = await findUserSingleValuebyEncField('User', 'username', username, 'username');

    // Validate username
    if (!username || isEmptyString(username)) {
        errors.username = "Username is required";
    } else if (!validateInput(username, 'username')) {
        errors.username = "Username should be between 5 to 10 alphabets";
    } else if (usernameExists) {
        errors.username = (usernameExists === userData.username)
            ? "You cannot use your current username"
            : "Username is taken by another user";
    }

    return formatResponse(errors);
};

module.exports = {
    validateEmailChange,
    validateUsernameChange
};
