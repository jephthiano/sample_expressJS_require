const Joi = require('joi');

const loginJoi = Joi.object({
    login_id: Joi.string().trim().required().messages({
        'string.base': 'login ID must be a string',
        'string.empty': 'login ID cannot be empty',
        'any.required': 'login ID is required'
    }),
    password: Joi.string().trim().required().messages({
        'string.base': 'password must be a string',
        'string.empty': 'password cannot be empty',
        'any.required': 'password is required'
    })
});


const verifyOtpDto = Joi.object({
    code: Joi.string()
        .trim()
        .required()
        .length(6)
        .pattern(/^[0-9]{6}$/) // Ensures the code is numeric and exactly 6 digits
        .messages({
            'string.base': 'Invalid OTP code',
            'string.empty': 'Invalid OTP code',
            'any.required': 'Invalid OTP code',
            'string.length': 'Invalid OTP code',
            'string.pattern.base': 'Invalid OTP code'
        }),
});

module.exports = { loginJoi, verifyOtpJoi };