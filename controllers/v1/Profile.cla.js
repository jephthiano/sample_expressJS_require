const UserSch = require(MODELS + 'User.schema');
const OtpSch = require(MODELS + 'OtpToken.schema');

const Security = require('@main_util/Security.cla');
const General = require('@main_util/general.cla');
const Otp = require('@main_util/otp.cla');
// const Messaging = require('@main_util/messaging.cla');

class Profile {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.userData = this.req.data.userData;
        this.input = this.req.data.input;

        this.response = {
            status:false,
            message: "failed",
            message_detail:"Error occurred while running request",
            response_data:{},
            error_data:{}
        }
    }

    static logInfo(type, data){
        General.log(type,data,'info');
    }

    static logError(type, data){
        General.log(type,data,'error');
    }

    // CHANGE USERNAME
    async changeUsername() {
        try {
            let { username } = this.input
            const { id: user_id } = this.userData

            username = Security.sel_encry(username.toLowerCase(), 'username')

            //update email
            const changeUsername = await UserSch.findByIdAndUpdate(user_id, { username }); 

            if(changeUsername){  
                //set response
                this.response['status'] = true;
                this.response['message'] = "success";
                this.response['message_detail'] = "Username successfully changed";
            }

        }catch(err){
            Profile.logError('Change Username [PROFILE CLASS]', err);
        }

        return this.response;
    }

    // CHANGE EMAIL
    async changeEmail() {
        try {
            let { email } = this.input
            const { id: user_id } = this.userData

            email = Security.sel_encry(email.toLowerCase(), 'email')

            //update email
            const changeEmail = await UserSch.findByIdAndUpdate(user_id, { email, email_verification: false }); 

            if(changeEmail){  
                //set response
                this.response['status'] = true;
                this.response['message'] = "success";
                this.response['message_detail'] = "Email successfully changed";
            }

        }catch(err){
            Profile.logError('Change Email [PROFILE CLASS]', err);
        }

        return this.response;
    }

    // VERIFY EMAIL [SEND OTP]
    async sendOTP(type) {
        let error = true; let medium = '';
        
        try {
            let { email_verification, mobile_number_verification } = this.userData
            const { receiving_medium, first_name, send_medium, use_case } = this.input;

            if (type === 'email') {
                //check if user has verify email
                if (email_verification) {
                    this.response['message_detail'] = "You have already verified your email";
                } else {
                    error = false
                    medium = 'email'
                }

            } else if (type === 'mobile_number') {
                //check if user has verify email
                if (mobile_number_verification) {
                    this.response['message_detail'] = "You have already verified your mobile number";
                } else {
                    error = false
                    medium = 'mobile_number'
                }

            }

            //if no error [send otp]
            if (!error) {
                //send otp
                const otpSent = await Otp.sendOtp({first_name, receiving_medium, use_case , send_medium});
                if(otpSent){  
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "success";
                    this.response['message_detail'] = `OTP successfully sent to your ${medium}`;
                }
            }

        }catch(err){
            Profile.logError('Send OTP [PROFILE CLASS]', err);
        }

        return this.response;
    }


    // VERIFY EMAIL [VERIFY OTP]
    async verifyOTP(type) {
        this.response['message_detail'] = "Otp verification failed";

        try{
            const { code, receiving_medium, use_case } = this.input;
            let { id: user_id } = this.userData
            const verify = await Otp.verifyOtp({ receiving_medium, use_case, code }, 'new');
            

            if (verify === true) {
                const key = (type === 'email') ? 'mobile_number_verification' : 'email_verification';
                const medium = (type === 'email') ? 'Mobile number' : 'Email' ;

                //update the verification key
                const result = await UserSch.findByIdAndUpdate(user_id, { [key]: true }); 
                if (result) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "success";
                    this.response['message_detail'] = `${medium} successfully verified`;
                    
                    //delete the otp
                    await Otp.deleteOtp(Security.sel_encry(receiving_medium, 'general'));
                }

            } else if (verify === 'expired') {
                this.response['message_detail'] = "Otp code has expired";
            } else {
                this.response['message'] = "Incorrect otp code";
            }
            
        }catch(err){
            Profile.logError('Verify OTP [PROFILE CLASS]', err);
        }

        return this.response;
    }

}

module.exports = Profile;