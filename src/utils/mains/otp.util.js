const { isDateLapsed }  = require('@main_util/general.util');
const { generateUniqueId, verifyPassword }  = require('@main_util/security.util');
const { sendMessage }  = require('@main_util/messaging.util');
const { findOneOtpData, storeOtp, updateOtpStatus, deleteManyOtp } = require('@database/mongo/otp.db');
const { triggerError} = require('@core_util/handler.util');

// SEND OTP
const sendOtp = async (messageData) => {
    let response = false;
    messageData.code = String(generateUniqueId(6));
    messageData.type = 'otp_code';

    // Store OTP
    if (await storeOtp(messageData)) {
        // send code with otp [queue]
        sendMessage(messageData, 'queue');
        response = true;
    }

    return response;
};

// VERIFY OTP
const verifyNewOtp = async (data) => {
    const { receiving_medium, use_case, code } = data;

    const otpRecord = await findOneOtpData(receiving_medium, use_case, 'new');

    if(!otpRecord) triggerError("Incorrect otp code", [], 401);
    
    const { code: dbCode, reg_date } = otpRecord;
    
    // Verify if the provided code matches the stored one
    const isOtpCorrect = await verifyPassword(code, dbCode);

    if(!isOtpCorrect) triggerError("Incorrect otp code", [], 401);

    // update otp status to used
    if(!await updateOtpStatus({ receiving_medium, use_case, code })) triggerError("Error occurred while running request", [], 500); // Indicating an internal error occurred
    
    // Check if the OTP has expired (300 seconds = 5 minutes)
    if(isDateLapsed(reg_date, process.env.OTP_EXPIRY)) triggerError("Otp code has expired", []);

    return true;
};

const verifyUsedOtp = async (data) => {
    const { receiving_medium, use_case, code } = data;

    const otpRecord = await findOneOtpData(receiving_medium, use_case, 'used');

    if(!otpRecord) triggerError("Invalid Request", [], 403);

    const { code: dbCode, reg_date } = otpRecord;

    // Verify if the provided code matches the stored one
    const isOtpCorrect = await verifyPassword(code, dbCode);

    if(!isOtpCorrect) triggerError("Incorrect otp code", [], 401);
    
    if(isDateLapsed(reg_date, process.env.OTP_EXPIRY)) triggerError("Request timeout, try again", []);

    return true;
};

// DELETE OTP
const deleteOtp = async (receiving_medium) => {
    return await deleteManyOtp(receiving_medium);
};

module.exports = {
    sendOtp,
    verifyNewOtp,
    verifyUsedOtp,
    deleteOtp,
};
