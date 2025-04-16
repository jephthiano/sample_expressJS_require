const Validator = require(VALIDATORS + 'auth.val');
const BaseController = require(CONTROLLERS + 'BaseController.cla');
const AuthService = require(SERVICES + 'AuthService.cla');


class AuthController extends BaseController{

    // LOGIN
    static async login(req, res) {
        try {
            const { status, data } = await Validator.login(req.body);
            if (status) {
                this.triggerValidationError(data);
            }
    
            await AuthService.login(req, res);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // // [SEND OTP]
    // async sendOtp() {
    //     this.response['message'] = "Request for otp failed";
    //     try{
    //         const { receiving_medium, first_name, send_medium, use_case } = this.input;
    //         const sent = await Otp.sendOtp({first_name, receiving_medium, use_case, send_medium});
            
    //         if(sent){
    //             this.response['status'] = true;
    //             this.response['message'] = "Otp sent";
    //         }

    //     }catch(err){
    //         Auth.logError('Send Otp [AUTH CLASS]', err);
    //     }

    //     return this.response;
    // }

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

    // REGISTER
    async register(regType) {
        let regType = "multi";

    //validate inputs
    const { status, data } = await Validator.register(req.body, regType);

    try {
        const { status, data } = await Validator.register(req.body, regType);
        if (status) {
            this.triggerValidationError(data);
        }

        await AuthService.register(req, res);
    } catch (error) {
        this.handleException(res, error);
    }

    //if there is no error
    if(!error.status){
        const {veri_type, receiving_medium} = req.data.input
        if(regType === "multi")
            //set email or mobile_number into input data
            veri_type === 'email' ? req.data.input['email'] = receiving_medium : req.data.input['mobile_number'] = receiving_medium ;
        
        const AuthIns = new Auth(req, res);
        response = await AuthIns.register(regType);

        
    }else{
        //set the error in response data
        response['error_data'] = error.data;
    }
    
    Security.returnResponse(res, req, response);    
    return;
        
        this.response['message'] = "Account creation failed";
        try{
            let result;
            
            //IF IT MULTI FORM
            if(regType === 'multi'){
                const {receiving_medium, veri_type, code} = this.input;
                //verify code
                const verify = await Otp.verifyOtp({receiving_medium, use_case:'register', code}, 'used');
                if(verify === true){
                    //add email_veri or mobile_veri
                    if(veri_type === 'email'){
                        this.input.email_verification = true;
                    }else{
                        this.input.mobile_number_verification = true;
                    }

                    result = await UserSch.create(this.input);
                    
                    //delete otp
                    await Otp.deleteOtp(Security.sel_encry(receiving_medium, 'general'));
                }else if(verify === 'expired'){
                    this.response['message'] = "Request timeout, try again";
                }
            }else{
                result = await UserSch.create(this.input);
            }


            if(result){
                const data = await Fetch.neededData(result.id);
                
                if(data){
                    //set response
                    this.response['status'] = true;
                    this.response['id'] = data.unique_id;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Account successfully created";
                    this.response['response_data'] = data;
                    
                    //send email
                    const messageData = {
                        name: this.input.first_name,
                        receiver : this.input.email,
                        subject : Messaging.subjectTemplate('welcome'),
                        message: Messaging.messageTemplate('welcome', 'email')
                    }
                    Messaging.sendEmail(messageData)
                }
            }

        }catch(err){
            Auth.logError('Register [AUTH CLASS]', err);
        }

        return this.response;
    }

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