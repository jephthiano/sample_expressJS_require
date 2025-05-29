const BaseController = require(CONTROLLERS + 'BaseController.cla');
const AuthService = require(SERVICES + 'AuthService.cla');
const { register, sendOtp, verifyOtp, signup, resetPassword} = require(VALIDATORS + 'custom/auth.val');
const { loginJoi } = require(VALIDATORS + 'joi/auth.joi');
const { parseMessageToObject } = require(MAIN_UTILS + 'general.util');


class AuthController extends BaseController{

    // LOGIN
    static async login(req, res) {
        try {

            // Validate inputs using Joi DTO
            const { error, value } = loginJoi.validate(req.body, { abortEarly: false });
            if (error) this.triggerValidationError(parseMessageToObject(error));

            await AuthService.login(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // REGISTER
    static async register(req, res) {
        try {
            //validate inputs
            const { status, data } = await register(req.body, 'single');
            if (status) this.triggerValidationError(data);

            await AuthService.register(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SEND OTP
    static async sendOtp(req, res) {
        const { type } = req.params;

        try {
            if(type !== 'sign_up' && type !== 'forgot_password'){
                this.triggerError("Invalid Request", []);
            }

            //validate inputs
            const { status, data } = await sendOtp(req.body, type);
            if (status) this.triggerValidationError(data);

            await AuthService.sendOtp(req, res, type);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // VERIFY OTP
    static async verifyOtp(req, res) {
        const { type } = req.params;

        try {
            if(type !== 'sign_up' && type !== 'forgot_password'){
                this.triggerError("Invalid Request", []);
            }

            // validate inputs
            const { status, data } = await verifyOtp(req.body, type);
            if (status) this.triggerValidationError(data);
            
            await AuthService.verifyOtp(req, res, type);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SIGNUP
    static async signup(req, res) {
        try {
            //validate inputs
            const { status, data } = await signup(req.body, 'multi');
            if (status) this.triggerValidationError(data);

            await AuthService.signup(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // RESET PASSWORD
    static async resetPassword(req, res) {
        try {
            //validate inputs
            const { status, data } = await resetPassword(req.body);
            if (status) this.triggerValidationError(data);

            await AuthService.resetPassword(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }


    // LOGOUT
    static async logout(req, res) {
        try {
            // delete cookies
        } catch (error) {
            this.handleException(res, error);
        }
    }
    
}

module.exports = AuthController;