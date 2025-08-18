const AuthRepository = require('#repository/AuthRepository.cla');
const { verifyPassword, validateInput }  = require('#main_util/security.util');
const { sendOtp, verifyNewOtp, verifyUsedOtp}  = require('#main_util/otp.util');
const { queueDeleteOtp } = require('#queue/deleteOtpQueue');
const { sendMessage } = require('#main_util/messaging.util');
const { deleteApiToken } = require('#main_util/token.util');
const { triggerError} = require('#core_util/handler.util');

const FetchController = require('#controller/v1/FetchController.cla');

class AuthService{

    // LOGIN
    static async login(inputData) {
        const { login_id, password } = inputData;

        // Get user data by login ID
        const user = await AuthRepository.getUserByLoginId(login_id);
        if (!user) triggerError("Incorrect login details", [], 401);

        // Verify password (async if using bcrypt.compare)
        const { password: dbPassword, status: userStatus, id: userId } = user;
        const  isPasswordValid = await verifyPassword(password, dbPassword, userId);
        if (!isPasswordValid) triggerError("Incorrect login details", [], 401);

        // Check account status
        if (userStatus === 'suspended') triggerError("Your account has been suspended, contact admin", []);

        // Fetch needed data
        return await FetchController.authFetchData(user);
    }

    // REGISTER
    static async register(inputData) {
        // Create user
        const user = await AuthRepository.createUser(inputData);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [PASS TO QUEUE JOB]
        sendMessage({ first_name: inputData.first_name, receiving_medium: inputData.email, send_medium: 'email', message_type: 'welcome' }, 'queue');
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    // [SEND OTP]
    static async sendOtp(inputData, use_case) {
        const { receiving_medium } = inputData;

        const data = {
            receiving_medium,
            send_medium : (validateInput(receiving_medium, 'email')) ? 'email' : 'whatsapp',
            use_case,
            
        };

        const sent = await sendOtp(data);
        if(!sent) triggerError("Request for otp failed", [], 500)

        return [];
    }

    // [VERIFY OTP]
    static async verifyOtp(inputData, use_case) {
        const {code, receiving_medium } = inputData;
        const data = { receiving_medium, code, use_case, };

        await verifyNewOtp(data);

        return [];
    }

    static async signup(inputData) {
        const { receiving_medium, code, first_name, email } = inputData;
    
        await verifyUsedOtp({ receiving_medium, use_case: 'sign_up', code });

        // Create user
        const user = await AuthRepository.createUser(inputData);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [queue]
        sendMessage({ first_name, receiving_medium: email, send_medium: 'email', message_type: 'welcome' }, 'queue');
        // Clean up OTP [queue]
        queueDeleteOtp(receiving_medium);
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    //FORGOT PASSWORD [RESET PASSWORD]
    static async resetPassword(inputData) {
        const { code, receiving_medium } = inputData;
        
        await verifyUsedOtp({ receiving_medium, use_case: 'forgot_password', code }); 

        const updateUserData = await AuthRepository.updatePassword(inputData);
        if(!updateUserData) triggerError("Password reset failed", [], 500);

        
        // Send password reset notification email [queue]
        sendMessage(
            { 
                first_name: updateUserData.first_name,
                receiving_medium: updateUserData.email,
                send_medium: 'email', 
                message_type: 'reset_password' 
            }
            , 'queue'
        );
        // Clean up OTP [quue]
        await queueDeleteOtp(receiving_medium);
        
        return;
    }
    

    static async logout(token) {

        const response = await deleteApiToken(token);

        if(!response) triggerError("Request failed, try again", [], 500)

        return response;
    }

}

module.exports = AuthService;