function createUserDTO(data) {
    return {
        email: data.email?.trim().toLowerCase(),
        mobile_number: data.mobile_number?.trim(),
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        username: data.username?.trim().toLowerCase(),
        gender: data.gender?.trim(),
        password: data.password,
    };
}

function updatePasswordDTO(data) {
    return {
        receiving_medium: data.email?.trim().toLowerCase(),
        password: data.password,
    };
}

module.exports = { createUserDTO, updatePasswordDTO };
