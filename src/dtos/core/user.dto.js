function createUserDTO(data) {
    return {
        email: data.email,
        mobile_number: data.mobile_number,
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        username: data.username?.trim().toLowerCase(),
        gender: data.gender?.trim(),
        password: data.password,
        email_verified_at: data.email_verified_at,
        mobile_number_verified_at: data.mobile_number_verified_at,
    };
}

function updatePasswordDTO(data) {
    return {
        receiving_medium: data.receiving_medium?.trim().toLowerCase(),
        password: data.password,
    };
}

module.exports = { createUserDTO, updatePasswordDTO };
