const BaseController = require('#controller/BaseController.cla');
const AuthService = require('#service/v1/AuthService.cla');
const { register, sendOtp, verifyOtp, signup, resetPassword} = require('#validator_util/custom/auth.val');
const { loginJoi } = require('#validator_util/joi/auth.joi');
const { parseMessageToObject } = require('#main_util/general.util');
const { setTokenCookie } = require('#main_util/cookie.util');
const { isValidOtpParam } = require('#main_util/otp.util');
const { getApiToken } = require('#main_util/token.util.js');
const { loginInputDto, registerInputDto, sendOtpInputDto, verifyOtpInputDto, signupInputDto, resetPasswordInputDto } = require('#src/dtos/input/auth.dto.js');


class AuthController extends BaseController{

    // LOGIN
    static async login(req, res) {
        try {
            
            // Validate inputs using Joi DTO
            const { error, value } = loginJoi.validate(req.body, { abortEarly: false });
            if (error) this.triggerValidationError(parseMessageToObject(error.details));
            
            // pass pure data from dto [not raw data]
            const inputData = loginInputDto(req.body);

            const response = await AuthService.login(inputData);

            setTokenCookie(res, response);
            this.sendResponse(res, response, "Login successful");
        } catch (error) {
            this.handleException(res, error);
        }

    }

    // REGISTER
    static async register(req, res) {
        try {
            //validate inputs
            const { status, data } = await register(req.body);
            if (status) this.triggerValidationError(data);

            // pass pure data from dto [not raw data]
            const inputData = registerInputDto(req.body);

            const response = await AuthService.register(inputData);

            setTokenCookie(res, response);
            this.sendResponse(res, response, "Account successfully created");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SEND OTP
    static async sendOtp(req, res) {
        const { type } = req.params;

        try {
            if(!isValidOtpParam(type)) this.triggerError("Invalid Request", []); // check if it is a valid otp medium

            //validate inputs
            const { status, data } = await sendOtp(req.body, type);
            if (status) this.triggerValidationError(data);

            // pass pure data from dto [not raw data]
            const inputData = sendOtpInputDto(req.body);

            const response = await AuthService.sendOtp(inputData, type);

            this.sendResponse(res, response, "Otp code successful sent");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // VERIFY OTP
    static async verifyOtp(req, res) {
        const { type } = req.params;

        try {
            if(!isValidOtpParam(type)) this.triggerError("Invalid Request", []); // check if it is a valid otp medium

            // validate inputs
            const { status, data } = await verifyOtp(req.body, type);
            if (status) this.triggerValidationError(data);

            // pass pure data from dto [not raw data]
            const inputData = verifyOtpInputDto(req.body);
            
            const response =  await AuthService.verifyOtp(inputData, type);

            return this.sendResponse(res, response, "Otp code successful verified");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SIGNUP
    static async signup(req, res) {
        try {
            //validate inputs
            const { status, data } = await signup(req.body);
            if (status) this.triggerValidationError(data);

            // pass pure data from dto [not raw data]
            const inputData = signupInputDto(req.body);

            const response =  await AuthService.signup(inputData);

            setTokenCookie(res, response);
            this.sendResponse(res, response, "Account successfully created");
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

            // pass pure data from dto [not raw data]
            const inputData = resetPasswordInputDto(req.body);

           const response =  await AuthService.resetPassword(inputData);
           
           this.sendResponse(res, response, "Password successfully reset");
        } catch (error) {
            this.handleException(res, error);
        }
    }


    // LOGOUT
    static async logout(req, res) {
         try {
            const token = getApiToken(req);

            if (!token) this.triggerError("Request failed, try again", [], 400);

            const response =  await AuthService.logout(token);

            this.sendResponse(res, response, "Logout successfully");
        } catch (error) {
            this.handleException(res, error);
        }
    }
    
}

module.exports = AuthController;