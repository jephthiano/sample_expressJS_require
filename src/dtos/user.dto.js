const { validateInput } = require('@main_util/security.util');

function createUserDTO(data) {
    const veriType = data.receiving_medium 
                ? validateInput(data.receiving_medium) ? 'mobile_number' : 'email'
                : null ;
                
    let email; let mobile_number; 
    let email_verified_at = null; let mobile_number_verified_at = null
    
    if(veriType){
        if (veriType === 'email') {
            email_verified_at = new Date();
            email = data.receiving_medium;
            mobile_number = data.mobile_number?.trim();
        } else {
            mobile_number_verified_at = new Date();
            mobile_number = data.receiving_medium;
            email = data.email?.trim().toLowerCase();
        }
    }else{
        email = data.email?.trim().toLowerCase();
        mobile_number = data.mobile_number?.trim();
    }

    return {
        email,
        mobile_number,
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        username: data.username?.trim().toLowerCase(),
        gender: data.gender?.trim(),
        password: data.password,
        email_verified_at,
        mobile_number_verified_at,
    };
}

function updatePasswordDTO(data) {
    return {
        receiving_medium: data.receiving_medium?.trim().toLowerCase(),
        password: data.password,
    };
}


module.exports = { createUserDTO, updatePasswordDTO };
