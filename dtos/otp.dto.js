function createOtpDTO(data) {

    return {
        receiving_medium: data.receiving_medium?.trim().toLowerCase(),
        use_case: data.use_case?.trim(),
        code: data.code?.trim(),
    };
}

module.exports = { createOtpDTO };
