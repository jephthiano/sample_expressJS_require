const { validateInput }  = require('#main_util/security.util');

const  loginInputDto = (data) => {
    return {
        login_id: data.login_id.trim().toLowerCase(),
        password: data.password,
    };
}


const registerInputDto = (data) => {
    return {
        email: data.email.trim().toLowerCase(),
        mobile_number: data.mobile_number,
        username: data.username.trim(),
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender.trim().toLowerCase(),
        password: data.password,
        email_verified_at: null,
        mobile_number_verified_at: null,
    }
}

const sendOtpInputDto = (data) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
    }
}

const verifyOtpInputDto = (data) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
    }
}


const signupInputDto = (data) => {
    const veriType = validateInput(data.receiving_medium, 'mobile_number') ? 'mobile_number' : 'email'
                
    const email = (veriType === 'email')  ? data.receiving_medium.trim().toLowerCase() : data.email?.trim().toLowerCase();
    const mobile_number = (veriType === 'mobile_number') ? data.receiving_medium?.trim() : data.mobile_number?.trim();
    const email_verified_at = (veriType === 'email') ? new Date() : null;
    const mobile_number_verified_at = (veriType === 'mobile_number') ? new Date() : null;

    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
        email,
        mobile_number,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        password: data.password,
        email_verified_at,
        mobile_number_verified_at,
    }
}

const resetPasswordInputDto = (data) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
        password: data.password,
        confirm_password: data.confirm_password,
    }
}


module.exports = { 
    loginInputDto,
    registerInputDto,
    sendOtpInputDto,
    verifyOtpInputDto,
    signupInputDto,
    resetPasswordInputDto
 };