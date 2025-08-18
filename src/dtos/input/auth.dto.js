const  LoginInputDto = (data = {}) => {
    return {
        login_id: data.login_id.trim().toLowerCase(),
        password: data.password,
    };
}


const registerInputDto = (data = {}) => {
    return {
        email: data.email.trim().toLowerCase(),
        mobile_number: data.mobile_number,
        username: data.username.trim(),
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender.trim().toLowerCase(),
        password: data.password,
    }
}

const sendOtpInputDto = (data = {}) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
    }
}

const verifyOtpInputDto = (data = {}) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
    }
}


const signupInputDto = (data = {}) => {
    const veriType = validateInput(data.receiving_medium, 'mobile_number') ? 'mobile_number' : 'email'
                
    let email; 
    let mobile_number; 
    let email_verified_at = null; 
    let mobile_number_verified_at = null

    if (veriType === 'email') {
        mobile_number = data.mobile_number?.trim();
        email = data.receiving_medium.trim().toLowerCase();
        email_verified_at = new Date();
    } else {
        email = data.email?.trim().toLowerCase();
        mobile_number = data.receiving_medium;
        mobile_number_verified_at = new Date();
    }

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

const resetPasswordInputDto = (data = {}) => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
        password: data.password,
        confirm_password: data.confirm_password,
    }
}


module.exports = { 
    LoginInputDto,
    registerInputDto,
    sendOtpInputDto,
    verifyOtpInputDto,
    signupInputDto,
    resetPasswordInputDto
 };