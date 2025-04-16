const AuthRepository = require(REPOSITORIES + 'AuthRepository.cla');
const BaseService = require(SERVICES + 'BaseService.cla');
const { verifyPassword, }  = require(MAIN_UTILS + 'security.util');

// const Fetch = require(CONTROLLERS + 'Fetch.cla');

class AuthService extends BaseService{

    // LOGIN
    static async login(req, res) {
        try{
            const {login_id , password} = req.body;

            //get user data
            const user = await AuthRepository.getUserByLoginId(res, login_id);
            if(user){ 
                const dbPassword = user.password;
                const userStatus = user.status;

                if(verifyPassword(password, dbPassword)){
                    if(userStatus === 'suspended'){
                        this.triggerError("Your account has been suspended", []);
                    }else{
                        // const data = await Fetch.neededData(user.id);
                        if(data){
                            this.sendResponse(res, user, "Success");
                            //set auth [with jwt and cookies]
                            //or token depending on settings
                        }
                    }
                }
            }else{
                this.triggerError("Incorrect login details", []);
            }
            
        }catch(error){
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
    //         AuthService.logError('Send Otp [AUTHService CLASS]', err);
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
    //         AuthService.logError('Verify Otp [AUTHService CLASS]', err);
    //     }

    //     return this.response;
    // }

    // // REGISTER
    // async register(regType) {
    //     // return this.sendResponse(res, newUser, "User created successfully", true, [], 201);
        
    //     this.response['message'] = "Account creation failed";
    //     try{
    //         let result;
            
    //         //IF IT MULTI FORM
    //         if(regType === 'multi'){
    //             const {receiving_medium, veri_type, code} = this.input;
    //             //verify code
    //             const verify = await Otp.verifyOtp({receiving_medium, use_case:'register', code}, 'used');
    //             if(verify === true){
    //                 //add email_veri or mobile_veri
    //                 if(veri_type === 'email'){
    //                     this.input.email_verification = true;
    //                 }else{
    //                     this.input.mobile_number_verification = true;
    //                 }

    //                 result = await UserSch.create(this.input);
                    
    //                 //delete otp
    //                 await Otp.deleteOtp(Security.sel_encry(receiving_medium, 'general'));
    //             }else if(verify === 'expired'){
    //                 this.response['message'] = "Request timeout, try again";
    //             }
    //         }else{
    //             result = await UserSch.create(this.input);
    //         }


    //         if(result){
    //             const data = await Fetch.neededData(result.id);
                
    //             if(data){
    //                 //set response
    //                 this.response['status'] = true;
    //                 this.response['message'] = "Success";
    //                 this.response['message_detail'] = "Account successfully created";
    //                 this.response['response_data'] = data;
                    
    //                 //send email
    //                 const messageData = {
    //                     name: this.input.first_name,
    //                     receiver : this.input.email,
    //                     subject : Messaging.subjectTemplate('welcome'),
    //                     message: Messaging.messageTemplate('welcome', 'email')
    //                 }
    //                 Messaging.sendEmail(messageData)
    //             }
    //         }

    //     }catch(err){
    //         AuthService.logError('Register [AUTHService CLASS]', err);
    //     }

    //     return this.response;

    // if (response.status) {
    //     //set auth [with jwt and cookies]
    //     const token = await Token.setToken(response.id);
    //     //Cookie.setCookies(req, res, 'token', token)
    //     res.cookie("_menatreyd", token);
        
    //     //unset id key
    //     delete response['id']
    // }
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
    //         AuthService.logError('Verify Otp [AUTHService CLASS]', err);
    //     }

    //     return this.response;
    // }
    
}

module.exports = AuthService;