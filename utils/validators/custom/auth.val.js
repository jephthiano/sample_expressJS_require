const { findSingleValue } = require(MAIN_UTILS + "database.util");
const User = require(MODELS + 'User.schema');
const { isEmptyObject, isEmptyString, replaceValues, isPhoneSample }  = require(MAIN_UTILS + 'general.util');
const { validateInput, selEncrypt, validatePassword }  = require(MAIN_UTILS + 'security.util');

// Utility function for response formatting
const formatResponse = (errors) => ({
    status: !isEmptyObject(errors),
    data: errors
});

// Login function
const login = async (inputs) => {
    const errors = {};
    const { login_id, password } = inputs;

    if (!login_id || isEmptyString(login_id)) {
        errors.login_id = "login ID cannot be empty";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "password cannot be empty";
    }

    return formatResponse(errors);
};

// signup or forgot_password otp validation
const sendOtp = async (inputs, type) => {
    const errors = {};
    const { receiving_medium } = inputs;
    const veriType = isPhoneSample(receiving_medium) ? 'mobile_number' : 'email';
    const resType = replaceValues(veriType, '_', ' ')

    if (type === 'sign_up') {
        const enc_receiving_medium = selEncrypt(receiving_medium, 'email');

        const data_exists = await User.findOne(
            { $or: [{ mobile_number: enc_receiving_medium }, { email: enc_receiving_medium }] },
            'first_name'
        );

        if (!receiving_medium || isEmptyString(receiving_medium)) {
            errors.receiving_medium = "field is required";
        } else if (data_exists) {
            errors.receiving_medium = `${resType} already taken`;
        } else if (!validateInput(receiving_medium, veriType)) {
            errors.receiving_medium = `invalid ${resType}`;
        }
    } else {
        const { receiving_medium } = inputs;
        const enc_receiving_medium = selEncrypt(receiving_medium, 'email');

        const data_exists = await User.findOne(
            { $or: [{ mobile_number: enc_receiving_medium }, { email: enc_receiving_medium }] },
            'first_name'
        );

        if (!receiving_medium || isEmptyString(receiving_medium)) {
            errors.receiving_medium = `${resType} is required`;
        } else if (!data_exists) {
            errors.receiving_medium = `${resType} does not exist`;
        }
    }

    return formatResponse(errors);
};

// Verify OTP
const verifyOtp = async (inputs) => {
    const errors = {};
    const { code } = inputs;

    if (!code || !validateInput(code, 'otp_code')) {
        errors.code = "invalid OTP code";
    }

    return formatResponse(errors);
};

// User Registration
const register = async (inputs, reg_type) => {
    const errors = {};
    const {veriType, email, mobile_number, first_name, last_name, username, gender, password } = inputs;

    const [email_exists, mobile_exists, username_exists] = await Promise.all([
        findSingleValue('User', 'email', selEncrypt(email, 'email'), 'email'),
        findSingleValue('User', 'mobile_number', selEncrypt(mobile_number, 'mobile_number'), 'mobile_number'),
        findSingleValue('User', 'username', selEncrypt(username, 'username'), 'username')
    ]);

    // Handle email and mobile number based on veriType
    if (reg_type === 'multi') {
        //for multi registration
        if (!mobile_number || isEmptyString(mobile_number)) {
            errors.mobile_number = "mobile number is required";
        } else if (!validateInput(mobile_number, 'mobile_number')) {
            errors.mobile_number = "invalid mobile number";
        } else if (mobile_exists) {
            errors.mobile_number = "mobile number already exists";
        }
    } else {
        //for single registration
        if (!email || isEmptyString(email)) {
            errors.email = "email is required";
        } else if (!validateInput(email, 'email')) {
            errors.email = "invalid email";
        } else if (email_exists) {
            errors.email = "email already exists";
        }

        if (!mobile_number || isEmptyString(mobile_number)) {
            errors.mobile_number = "mobile number is required";
        } else if (!validateInput(mobile_number, 'mobile_number')) {
            errors.mobile_number = "invalid mobile number";
        } else if (mobile_exists) {
            errors.mobile_number = "mobile number already exists";
        }
    }

    if (!username || isEmptyString(username)) {
        errors.username = "username is required";
    } else if (!validateInput(username, 'username')) {
        errors.username = "username should be between 5 to 10 alphabets";
    } else if (username_exists) {
        errors.username = "username already taken";
    }

    if (!first_name || isEmptyString(first_name)) {
        errors.first_name = "first name is required";
    } else if (!validateInput(first_name, 'name')) {
        errors.first_name = "invalid first name";
    }

    if (!last_name || isEmptyString(last_name)) {
        errors.last_name = "last name is required";
    } else if (!validateInput(last_name, 'name')) {
        errors.last_name = "invalid last name";
    }

    if (!gender || (gender !== 'male' && gender !== 'female')) {
        errors.gender = "invalid gender";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "password is required";
    } else if (!validatePassword(password)) {
        errors.password = "password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    }

    return formatResponse(errors);
};

// Reset Password
const resetPassword = (inputs) => {
    const errors = {};
    const { password, confirm_password } = inputs;

    if (!validatePassword(password)) {
        errors.password = "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    } else if (password !== confirm_password) {
        errors.password = "Passwords do not match";
    }

    return formatResponse(errors);
};

module.exports = { login, 
                    sendOtp, 
                    verifyOtp, 
                    register, 
                    resetPassword
                };
