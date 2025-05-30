const BaseService = require(SERVICES + 'BaseService.cla');
const AuthRepository = require(REPOSITORIES + 'AuthRepository.cla');
const { verifyPassword, selEncrypt, validateInput }  = require(MAIN_UTILS + 'security.util');
const { sendOtp, verifyOtpNew, verifyOtpUsed, deleteOtp}  = require(MAIN_UTILS + 'otp.util');
const { sendEmail }  = require(MAIN_UTILS + 'messaging.util');
const { sendMessageDTO } = require(DTOS + 'messaging.dto');
const { queueMessaging } = require(QUEUES + 'messagingQueue');
const { deleteToken } = require(MAIN_UTILS + 'token.util');

const FetchController = require(CONTROLLERS + 'v1/FetchController.cla');

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
                return this.triggerError("Your account has been suspended, contact admin", []);
            }
    
            // Fetch needed data
            const data = await FetchController.authFetchData(res, user);

            return this.sendResponse(res, data, "Login successful");
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    // REGISTER
    static async register(req, res) {
        try {
            const { first_name, email } = req.body;

            // Create user
            const user = await AuthRepository.createUser(res, req.body);
            if (!user) {
                return this.triggerError("Account creation failed", []);
            }
    
            // Fetch user-related data
            const data = await FetchController.authFetchData(res, user);    
            
            // Send success response
            this.sendResponse(res, data, "Account successfully created");

            // Send welcome email [PASS TO QUEUE JOB]
            // Queue welcome email
            // await queueMessaging(email, 'Welcome to My App!', `Hi ${name}, thanks for registering!`);
            const messageData = sendMessageDTO({ first_name, receiving_medium: email, type: 'welcome' });
            sendEmail(messageData);
            
            return;
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    // [SEND OTP]
    static async sendOtp(req, res, type) {
        const { receiving_medium } = req.body;
        try {
            const data = {
                receiving_medium,
                send_medium : (validateInput(receiving_medium, 'email')) ? 'email' : 'whatsapp',
                use_case : type,
                first_name : 'user',
                
            };

            const sent = await sendOtp(data);

            if(!sent){
                return this.triggerError("Request for otp failed", []);
            }

            return this.sendResponse(res, [], "Otp code successful sent");
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

            const verify = await verifyOtpNew(data);

            if(!verify){ // for incorrect
                return this.triggerError("Incorrect otp code", []);
            }

            if(verify === 'expired'){ // for expired
                return this.triggerError("Otp code has expired", []);
            }

            if(verify === 'error'){ // for internal error
                return this.triggerError("Error occurred while running request", []);
            }
            
            return this.sendResponse(res, [], "Otp code successful verified");
        } catch (error) {
            return this.handleException(res, error);
        }
    }

    static async signup(req, res) {
        const { receiving_medium, code, first_name, email } = req.body;
        const veriType = validateInput(receiving_medium) ? 'mobile_number' : 'email';
        
        try {
    
            const verifyOtp = await verifyOtpUsed({ receiving_medium, use_case: 'sign_up', code });
                
            if(!verifyOtp) {
                return this.triggerError("Invalid Request", []);
            }

            if (verifyOtp === 'expired') {
                return this.triggerError("Request timeout, try again", []);
            } 

            // Mark verification based on type
            if (veriType === 'email') {
                req.body.email_verified_at = new Date();
                req.body.mobile_number = receiving_medium;
            } else {
                req.body.mobile_number_verified_at = new Date();
                req.body.email = receiving_medium;
            }
    
            // Create user
            const user = await AuthRepository.createUser(res, req.body);
            if (!user) {
                return this.triggerError("Account creation failed", []);
            }

            // Fetch user-related data
            const data = await FetchController.neededData(user);
            
            // Send success response
            this.sendResponse(res, data, "Account successfully created");
    
            //[PASS BELOW TO QUEUE JOB]
            // Clean up OTP
            deleteOtp(selEncrypt(receiving_medium, 'general'));
    
            // Send welcome email [PASS TO QUEUE JOB]
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
    
            if(!verifyOtp) {
                return this.triggerError("Invalid Request", []);
            }

            if (verifyOtp === 'expired') {
                return this.triggerError("Request timeout, try again", []);
            }

            const updateUserData = await AuthRepository.updatePassword(res, req.body);
            if(!updateUserData){
                return this.triggerError("Password reset failed", []);
            }

            // Send success response
            this.sendResponse(res, [], "Password successfully reset");

            //[PASS BELOW TO QUEUE JOB]
            // Clean up OTP
            await deleteOtp(receiving_medium);
            
            
            // Send password reset notification email
            const { first_name, email } = updateUserData;
            receiving_medium = selEncrypt(first_name, 'first_name');
            receiving_medium = selEncrypt(email, 'email');
            const messageData = sendMessageDTO({ first_name, receiving_medium, type: 'reset_password' });
            sendEmail(messageData);
            
            return;
        } catch (error) {
            return this.handleException(res, error);
        }
    }
    

    static async logout(req, res) {
        try {
            // set for cookies too
            if(process.env.TOKEN_SETTER === 'jwt') {
                    return this.sendResponse(res, [], "Logout successfully");
            } else if (process.env.TOKEN_SETTER === 'local_self') {
                if (!req.params.id || !(await deleteToken(req.params.id))) {
                    return this.triggerError("Request failed, try again", [])
                }

                return this.sendResponse(res, [], "Logout successfully");
            } else if (process.env.TOKEN_SETTER === 'redis_self') {
                if (!req.params.id || !(await deleteToken(req.params.id))) {
                    return this.triggerError("Request failed, try again", []);
                }

                return this.sendResponse(res, [], "Logout successfully");
            }
        } catch (error) {
            this.handleException(res, error);
        }
    }

}

module.exports = AuthService;