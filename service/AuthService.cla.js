const AuthRepository = require(REPOSITORIES + 'AuthRepository.cla');
const BaseService = require(SERVICES + 'BaseService.cla');
const { verifyPassword, selEncrypt }  = require(MAIN_UTILS + 'security.util');
const { sendOtp, deleteOtp}  = require(MAIN_UTILS + 'otp.util');
const { sendEmail, subjectTemplate, messageTemplate }  = require(MAIN_UTILS + 'messaging.util');

const Fetch = require(CONTROLLERS + 'FetchController.cla');

class AuthService extends BaseService{

    // LOGIN
    static async login(req, res) {
        try {
            const { login_id, password } = req.body;
    
            // Get user data by login ID
            const user = await AuthRepository.getUserByLoginId(res, login_id);
            if (!user) {
                return this.triggerError("Incorrect login details", []);
            }
    
            const { password: dbPassword, status: userStatus } = user;
    
            // Verify password (async if using bcrypt.compare)
            const  isPasswordValid = await verifyPassword(password, dbPassword);
            if (!isPasswordValid) {
                return this.triggerError("Incorrect login details", []);
            }
    
            // Check account status
            if (userStatus === 'suspended') {
                return this.triggerError("Your account has been suspended", []);
            }
    
            // Fetch needed data
            const data = await Fetch.neededData(user.id);

            this.sendResponse(res, data, "Login successful");
    
        } catch (error) {
            return this.handleException(res, error);
        }
    }
    

    // REGISTER
    static async register(req, res) {
        let result;
        try {
            const { veri_type, receiving_medium, code, first_name, email, reg_type } = req.body;
    
            // Handle multi-step verification if applicable
            if (reg_type === 'multi') {
                const verifyOtp = await sendOtp({ receiving_medium, use_case: 'register', code }, 'used');
                
                if (verifyOtp === true) {
                    // Mark verification based on type
                    if (veri_type === 'email') {
                        req.body.email_verification = true;
                    } else {
                        req.body.mobile_number_verification = true;
                    }
                } else if (verifyOtp === 'expired') {
                    return this.triggerError("Request timeout, try again", []);
                } else {
                    return this.triggerError("Invalid or used verification code", []);
                }
            }
    
            // Create user
            result = await AuthRepository.createUser(res, req.body);
            if (!result) {
                return this.triggerError("Account creation failed", []);
            }
    
            // Clean up OTP if multi
            if (reg_type === 'multi') {
                await deleteOtp(selEncrypt(receiving_medium, 'general'));
            }
    
            // Fetch user-related data
            const data = await Fetch.neededData(result.id);
    
            // Send success response
            this.sendResponse(res, data, "Account successfully created");
    
            // Send welcome email
            const messageData = {
                name: first_name,
                receiver: email,
                subject: subjectTemplate('welcome'),
                message: messageTemplate('welcome', 'email')
            };
            sendEmail(messageData);
    
        } catch (error) {
            return this.handleException(res, error);
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