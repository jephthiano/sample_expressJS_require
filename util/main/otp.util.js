const Otp = require(MODELS + 'OtpToken.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { isDateLapsed }  = require(MAIN_UTILS + 'general.util');
const { generateUniqueId, selEncrypt, }  = require(MAIN_UTILS + 'security.util');
const { sendEmail, sendWhatsappMessage }  = require(MAIN_UTILS + 'messaging.util');
const { createOtpDTO } = require(DTOS + 'otp.dto');
const { sendMessageDTO } = require(DTOS + 'messaging.dto');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

// SEND OTP
const sendOtp = async (data) => {
    let response = false;
    data.code = String(generateUniqueId(6));

    try {
        // Store OTP
        if (await storeOtp(data)) {
            // Prepare message data
            const messageData = sendMessageDTO(data, 'otp_code');

            // Send via email or WhatsApp
            if (send_medium === 'email') {
                response = await sendEmail(messageData);
            } else if (send_medium === 'whatsapp') {
                response = await sendWhatsappMessage(messageData);
            }

            // If sending fails, delete the OTP
            if (!response) {
                await deleteOtp(data.receiving_medium);
                response = false;
            }
                
        }
    } catch (err) {
        logError('Send OTP [OTP MODULE]', err);
        response = false; // Indicating an internal error occurred during sending
    }

    return response;
};

// VERIFY OTP
const verifyOtp = async (data, status = 'new') => {
    let response = false;

    try {
        const { receiving_medium, use_case, code } = data;
        
        // Encrypt the receiving medium using the general encryption method
        const encryptedMedium = selEncrypt(receiving_medium, 'general');

        // Look for the OTP record based on receiving medium, use case, and status
        const otpRecord = await Otp.findOne({ receiving_medium: encryptedMedium, use_case, status }, '-_id');

        if (otpRecord) {
            const { code: db_code, reg_date } = otpRecord;

            // Verify if the provided code matches the stored one
            if (verifyPassword(code, db_code)) {
                
                // If the OTP status is 'new', update it to 'used'
                if (status === 'new') {
                    if (await updateOtpStatus({ receiving_medium, use_case, code })) {
                        // Check if the OTP has expired (300 seconds = 5 minutes)
                        response = isDateLapsed(reg_date, 300) ? 'expired' : true;
                    }
                } else {
                    // For other status, simply check if it's expired
                    response = isDateLapsed(reg_date, 300) ? 'expired' : true;
                }
            }
        }
    } catch (err) {
        logError('Verify OTP [OTP MODULE]', err);
        response = false; // Indicating an internal error occurred during verification
    }

    return response;
};


// STORE OTP
const storeOtp = async (data) => {
    let result = null;

    try {
        const otpData = createOtpDTO(data);
        const { receiving_medium, code, use_case } = otpData;
        result = await Otp.findOneAndUpdate(
            { receiving_medium: selEncrypt(receiving_medium, 'email_phone') },
            { code, use_case, status: 'new' },
            { new: true }
        );

        // Insert new OTP if update failed
        if (!result) result = await Otp.create(otpData);
    } catch (err) {
        logError('Store OTP [OTP MODULE]', err);
    }
    return !!result;
};

// UPDATE OTP
const updateOtpStatus = async (data) => {
    let result = null;

    try {
        const otpData = createOtpDTO(data);
        const { receiving_medium, code, use_case } = otpData;
        
        const result = await Otp.findOneAndUpdate(
            { receiving_medium: selEncrypt(receiving_medium, 'email_phone') },
            { status: 'used' },
            { new: true }
        );

    } catch (err) {
        logError('Update OTP [OTP MODULE]', err);
    }

    return !!result; //convert value into boolean 
};

// DELETE OTP
const deleteOtp = async (receiving_medium) => {
    try {
        receiving_medium = selEncrypt(receiving_medium, 'email_phone');
        await Otp.deleteMany({ receiving_medium });
    } catch (err) {
        logError('Delete OTP [OTP MODULE]', err);
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    deleteOtp,
};
