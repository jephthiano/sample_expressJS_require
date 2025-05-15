const AuthRepository = require(REPOSITORIES + 'AuthRepository.cla');
const BaseService = require(SERVICES + 'BaseService.cla');
const { verifyPassword, selEncrypt, validateInput }  = require(MAIN_UTILS + 'security.util');
const { sendOtp, verifyOtpNew, verifyOtpUsed, deleteOtp}  = require(MAIN_UTILS + 'otp.util');
const { sendEmail }  = require(MAIN_UTILS + 'messaging.util');

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

            return this.sendResponse(res, data, "Login successful");
    
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    // [SEND OTP]
    static async sendOtp(req, res, type) {
        try {
            const data = {};
            data.receiving_medium = req.body.receiving_medium;
            data.send_medium = (validateInput(receiving_medium, 'email')) ? 'email' : 'whatsapp';
            data.use_case = type;
            data.first_name = 'user';

            const sent = await sendOtp({data});

            if(!sent){
                return this.triggerError("Request for otp failed", []);
            }

            return this.sendResponse(res, [], "Otp successful sent");
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    // [VERIFY OTP]
    static async verifyOtp(req, res, type) {
        try {
            const data = {
                receiving_medium: req.body.receiving_medium,
                code: req.body.code,
                use_case: type
            };

            const verify = await verifyOtpNew({data});

            if(!verify){
                return this.triggerError("Incorrect otp code", []);
            }

            if(verify === 'expired'){
                return this.triggerError("Otp code has expired", []);
            }

            if(verify === 'expired'){
                return this.triggerError("Error occurred while running request", []);
            }
            
            return this.sendResponse(res, [], "Otp successful verified");
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    // REGISTER
    static async register(req, res) {
        let result;
        try {
            const reg_type = 'single';
            const { veri_type, receiving_medium, code, first_name, email } = req.body;
    
            // Handle multi-step verification if applicable
            if (reg_type === 'multi') {
                const verifyOtp = await verifyOtpUsed({ receiving_medium, use_case: 'sign_up', code });
                 
                if(!verifyOtp) {
                    return this.triggerError("Invalid or used verification code", []);
                }

                if (verifyOtp === 'expired') {
                    return this.triggerError("Request timeout, try again", []);
                } 

                // Mark verification based on type
                if (veri_type === 'email') {
                    req.body.email_verification = true;
                } else {
                    req.body.mobile_number_verification = true;
                }
            }
    
            // Create user
            const result = await AuthRepository.createUser(res, req.body);
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
            const messageData = sendMessageDTO({ first_name, receiving_medium: email }, 'welcome');
            sendEmail(messageData);
    
            return;
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    //FORGOT PASSWORD [RESET PASSWORD]
    static async resetPassword(req, res) {
        try {
            const { code, receiving_medium } = req.body;
            const verifyOtp = await verifyOtpUsed({ receiving_medium, use_case: 'forgot_password', code }); 
    
            if(!verify){
                return this.triggerError("Incorrect otp code", []);
            }

            if(verify === 'expired'){
                return this.triggerError("Otp code has expired", []);
            }

            const updatePassword = await AuthRepository.updatePassword(req.body);
    
            if(!updatePassword){
                return this.triggerError("Password reset failed", []);
            }

            //delete otp
            await deleteOtp(receiving_medium);
            
            // Send success response
            this.sendResponse(res, data, "Account successfully created");
            
            // Send welcome email
            const { first_name, email } = updatePassword;
            const messageData = sendMessageDTO({ first_name, receiving_medium: email }, 'reset_password');
            sendEmail(messageData);

            return;
        } catch (error) {
            return this.handleException(res, error);
        }
    }

}

module.exports = AuthService;