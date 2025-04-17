const Joi = require('joi');

const loginDto = Joi.object({
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

module.exports = { loginDto };