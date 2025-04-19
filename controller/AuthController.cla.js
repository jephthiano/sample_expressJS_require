const { register} = require(VALIDATORS + 'custom/auth.val');
const { loginJoi } = require(VALIDATORS + 'joi/auth.joi');
const { parseMessageToObject } = require(MAIN_UTILS + 'general.util');
const BaseController = require(CONTROLLERS + 'BaseController.cla');
const AuthService = require(SERVICES + 'AuthService.cla');


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

    // SEND OTP
    static async sendOtp(req, res, type) {
        try {
            if(type !== 'sign_up' || type !== 'forgot_password'){
                this.triggerValidationError("Invalid Request", []);
            }

            // //validate inputs
            const { status, data } = await sendOtp(req.body, type);
            if (status) this.triggerValidationError(data);

            await AuthService.sendOtp(req, res, type);
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

            await AuthService.register(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // // [VERIFY OTP]
    // async verifyOtp() {
    //     this.response['message'] = "Otp verification failed";
    //     try{
    //         const { code, receiving_medium, use_case } = this.input;
    //         const verify = await Otp.verifyOtp({receiving_medium, use_case, code}, 'new');

    //         const enc_medium = Security.sel_encry(receiving_medium, 'general');
    //         if(verify === true){
    //             //update otp collection to used
    //             const result = await OtpSch.findOneAndUpdate(
    //                 {receiving_medium : enc_medium, use_case},
    //                 { status: 'used' },
    //                 { new: true }
    //             )
                
    //             if(result){
    //                 this.response['status'] = true;
    //                 this.response['message'] = "Otp successfully verified";
    //             }
    //         }else if (verify === 'expired'){
    //             this.response['message'] = "Otp code has expired";
    //         }else{
    //             this.response['message'] = "Incorrect otp code";
    //         }
            
    //     }catch(err){
    //         Auth.logError('Verify Otp [AUTH CLASS]', err);
    //     }

    //     return this.response;
    // }

    // //FORGOT PASSWORD [RESET PASSWORD]
    // async resetPassword() {
    //     this.response['message'] = "Password reset failed";
    //     try{
    //         const { password, code, receiving_medium } = this.input;
    //         const verify = await Otp.verifyOtp({receiving_medium, use_case:'forgot_password', code}, 'used');

    //         if(verify === true){
    //             const enc_medium = Security.sel_encry(receiving_medium, 'general')
    //             //update password
    //             const result = await UserSch.findOneAndUpdate(
    //                 {$or: [{ mobile_number: enc_medium }, { email: enc_medium }]},
    //                 { password },
    //                 { new: true }
    //             )
                
    //             if(result){
    //                 //delete otp
    //                 await Otp.deleteOtp(enc_medium);

    //                 //set response
    //                 this.response['status'] = true;
    //                 this.response['message'] = "Password successfully reset";
    //             }
    //         }else if (verify === 'expired'){
    //             this.response['message'] = "Request timeout";
    //         }
            
    //     }catch(err){
    //         Auth.logError('Verify Otp [AUTH CLASS]', err);
    //     }

    //     return this.response;
    // }
    
}

module.exports = AuthController;