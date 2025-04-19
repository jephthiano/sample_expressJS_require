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
            if (!response) await deleteOtp(data.receiving_medium);
        }
    } catch (err) {
        logError('Send OTP [OTP MODULE]', err);
    }

    return response;
};

// VERIFY OTP
const verifyOtp = async (data, status = 'new') => {
    let response = false;

    try {
        const { receiving_medium: rece_me, use_case, code } = data;
        const receiving_medium = selEncrypt(rece_me, 'general');
        const result = await Otp.findOne({ receiving_medium, use_case, status }, '-_id');

        if (result) {
            const { code: db_code, reg_date } = result;

            if (verifyPassword(code, db_code)) {
                response = isDateLapsed(reg_date, 300) ? 'expired' : true;
            }
        }
    } catch (err) {
        logError('Verify OTP [OTP MODULE]', err);
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
            { receiving_medium:
                selEncrypt(receiving_medium, 'email_phone') },
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
