const Otp = require(MODELS + 'OtpToken.schema');
const { log } = require('@main_util/logger.util');
const { isDateLapsed }  = require('@main_util/general.util');
const { generateUniqueId, selEncrypt, verifyPassword }  = require('@main_util/security.util');
const { sendMessage }  = require('@main_util/messaging.util');
const { createOtpDTO } = require('@dto/otp.dto');
const { sendMessageDTO } = require('@dto/messaging.dto');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

// SEND OTP
const sendOtp = async (data) => {
    let response = false;
    data.code = String(generateUniqueId(6));
    data.type = 'otp_code';

    try {
        // Store OTP
        if (await storeOtp(data)) {
            response = true;
            //MOVE TO QUEUE JOB [ if fail... otp will be deleted]
            const messageData = sendMessageDTO(data);
            sendMessage(messageData, data.send_medium);
            
            // if (!response) {
            //     await deleteOtp(data.receiving_medium);
            //     response = false;
            // }
                
        }
    } catch (err) {
        logError('Send OTP [OTP UTIL]', err);
        response = false; // Indicating an internal error occurred during sending
    }

    return response;
};

// VERIFY OTP
const verifyOtpNew = async (data) => {
    let response = false;

    try {
        const { receiving_medium, use_case, code } = data;
        const encryptedMedium = selEncrypt(receiving_medium, 'email_phone');
        
        // Look for the OTP record based on receiving medium, use case, and status
        const otpRecord = await Otp.findOne({ 
            receiving_medium: encryptedMedium,
            use_case, 
            status: 'new'
        });
        
        if (otpRecord) {
            const { code: dbCode, reg_date } = otpRecord;
            
            // Verify if the provided code matches the stored one
            if (await verifyPassword(code, dbCode)) {
                if(!await updateOtpStatus({ receiving_medium, use_case, code })) {
                    return 'error'; // Indicating an internal error occurred
                }   
                
                // Check if the OTP has expired (300 seconds = 5 minutes)
                response = isDateLapsed(reg_date, process.env.OTP_EXPIRY) ? 'expired' : true;
            }
        }
    } catch (err) {
        logError('Verify OTP [OTP MODULE]', err);
        response = 'error'; // Indicating an internal error occurred during verification
    }

    return response;
};

const verifyOtpUsed = async (data) => {
    let response = false;

    try {
        const { receiving_medium, use_case, code } = data;
        const encryptedMedium = selEncrypt(receiving_medium, 'email_phone');

        // Look for the OTP record based on receiving medium, use case, and status
        const otpRecord = await Otp.findOne({ receiving_medium: encryptedMedium, use_case, status: 'used' });

        if (otpRecord) {
            const { code: dbCode, reg_date } = otpRecord;
            // Verify if the provided code matches the stored one
            if (await verifyPassword(code, dbCode)) {
                response = isDateLapsed(reg_date, process.env.OTP_EXPIRY) ? 'expired' : true;
            }
        }
    } catch (err) {
        logError('Verify OTP [OTP MODULE]', err);
        response = 'error'; // Indicating an internal error occurred during verification
    }

    return response;
};


// STORE OTP
const storeOtp = async (data) => {
    let result = null;

    try {
        const otpData = createOtpDTO(data);
        const { receiving_medium, code, use_case } = otpData;
        const encryptedMedium = selEncrypt(receiving_medium, 'email_phone');


        result = await Otp.findOneAndUpdate(
            { receiving_medium: encryptedMedium },
            { code, use_case, status: 'new' },
            { new: true }
        );

        // Insert new OTP if update failed
        if (!result) result = await Otp.create(otpData);
    } catch (err) {
        logError('Store OTP [OTP MODULE]', err);
         result = false; // Indicating an internal error occurred during storing
    }
    return !!result;
};

// UPDATE OTP
const updateOtpStatus = async (data) => {
    let result = null;

    try {
        const otpData = createOtpDTO(data);
        const { receiving_medium, code, use_case } = otpData;
        
        result = await Otp.findOneAndUpdate(
            { receiving_medium: selEncrypt(receiving_medium, 'email_phone') },
            { status: 'used' },
            { new: true }
        );

    } catch (err) {
        logError('Update OTP [OTP MODULE]', err);
        result = false; // Indicating an internal error occurred during updating
    }

    return !!result; //convert value into boolean 
};

// DELETE OTP
const deleteOtp = async (receiving_medium) => {
    let result = null;
    try {
        receiving_medium = selEncrypt(receiving_medium, 'email_phone');
        result =  await Otp.deleteMany({ receiving_medium });
    } catch (err) {
        logError('Delete OTP [OTP MODULE]', err);
        result =  null;
    }

    return !!result; //convert value into boolean 
};

module.exports = {
    sendOtp,
    verifyOtpNew,
    verifyOtpUsed,
    deleteOtp,
};
