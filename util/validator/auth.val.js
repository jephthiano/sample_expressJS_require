const { findSingleValue } = require(CONFIGS + "database");
const UserSch = require(MODELS + 'User.schema');
const { isEmptyObject, isEmptyString }  = require(MAIN_UTILS + 'general.util');
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
        errors.login_id = "Login ID cannot be empty";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "Password cannot be empty";
    }

    return formatResponse(errors);
};

// // Send OTP during signup
// const suSendOtp = async (inputs) => {
//     const errors = {};
//     const { receiving_medium, veri_type } = inputs;
//     const enc_rece = selEncrypt(receiving_medium, 'email');

//     const data_exists = await UserSch.findOne(
//         { $or: [{ mobile_number: enc_rece }, { email: enc_rece }] },
//         'first_name'
//     );

//     const resType = veri_type === 'email' ? 'email' : 'mobile number';

//     if (!receiving_medium || isEmptyString(receiving_medium)) {
//         errors.receiving_medium = "Field is required";
//     } else if (data_exists) {
//         errors.receiving_medium = `${resType} already taken`;
//     } else if (!validateInput(receiving_medium, veri_type)) {
//         errors.receiving_medium = `Invalid ${resType}`;
//     }

//     return formatResponse(errors);
// };

// // Verify OTP
// const verifyOtp = async (inputs) => {
//     const errors = {};
//     const { code } = inputs;

//     if (!code || !validateInput(code, 'otp_code')) {
//         errors.code = "Invalid OTP code";
//     }

//     return formatResponse(errors);
// };

// User Registration
const register = async (inputs, regType) => {
    const errors = {};
    const { email, mobile_number, first_name, last_name, username, gender, password } = inputs;

    const [email_exists, mobile_exists, username_exists] = await Promise.all([
        findSingleValue('User', 'email', selEncrypt(email, 'email'), 'email'),
        findSingleValue('User', 'mobile_number', selEncrypt(mobile_number, 'mobile_number'), 'mobile_number'),
        findSingleValue('User', 'username', selEncrypt(username, 'username'), 'username')
    ]);

    // Handle email and mobile number based on regType
    if (regType === 'multi') {
        if (!mobile_number || isEmptyString(mobile_number)) {
            errors.mobile_number = "Mobile number is required";
        } else if (!validateInput(mobile_number, 'mobile_number')) {
            errors.mobile_number = "Invalid mobile number";
        } else if (mobile_exists) {
            errors.mobile_number = "Mobile number already exists";
        }
    } else {
        if (!email || isEmptyString(email)) {
            errors.email = "Email is required";
        } else if (!validateInput(email, 'email')) {
            errors.email = "Invalid email";
        } else if (email_exists) {
            errors.email = "Email already exists";
        }

        if (!mobile_number || isEmptyString(mobile_number)) {
            errors.mobile_number = "Mobile number is required";
        } else if (!validateInput(mobile_number, 'mobile_number')) {
            errors.mobile_number = "Invalid mobile number";
        } else if (mobile_exists) {
            errors.mobile_number = "Mobile number already exists";
        }
    }

    if (!username || isEmptyString(username)) {
        errors.username = "Username is required";
    } else if (!validateInput(username, 'username')) {
        errors.username = "Username should be between 5 to 10 alphabets";
    } else if (username_exists) {
        errors.username = "Username already taken";
    }

    if (!first_name || isEmptyString(first_name)) {
        errors.first_name = "First name is required";
    } else if (!validateInput(first_name, 'name')) {
        errors.first_name = "Invalid first name";
    }

    if (!last_name || isEmptyString(last_name)) {
        errors.last_name = "Last name is required";
    } else if (!validateInput(last_name, 'name')) {
        errors.last_name = "Invalid last name";
    }

    if (!gender || (gender !== 'male' && gender !== 'female')) {
        errors.gender = "Invalid gender";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "Password is required";
    } else if (!validatePassword(password)) {
        errors.password = "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    }

    return formatResponse(errors);
};

// // Send OTP for password reset
// const fpSendOtp = async (inputs) => {
//     const errors = {};
//     const { receiving_medium } = inputs;
//     const enc_rece = selEncrypt(receiving_medium, 'email');

//     const data_exists = await UserSch.findOne({ 
//         $or: [{ mobile_number: enc_rece }, { email: enc_rece }]
//     }, 'first_name');

//     if (!receiving_medium || isEmptyString(receiving_medium)) {
//         errors.receiving_medium = "Email/mobile number is required";
//     } else if (!data_exists) {
//         errors.receiving_medium = "Email/mobile number does not exist";
//     }

//     return formatResponse(errors);
// };

// // Reset Password
// const resetPassword = (inputs) => {
//     const errors = {};
//     const { password, confirm_password } = inputs;

//     if (!validatePassword(password)) {
//         errors.password = "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
//     } else if (password !== confirm_password) {
//         errors.password = "Passwords do not match";
//     }

//     return formatResponse(errors);
// };

module.exports = { login, 
                    // suSendOtp, 
                    // verifyOtp, 
                    // register, 
                    // fpSendOtp, 
                    // resetPassword
                };
