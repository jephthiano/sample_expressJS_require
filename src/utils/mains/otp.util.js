const Otp = require('@model/OtpToken.schema');
const { isDateLapsed }  = require('@main_util/general.util');
const { generateUniqueId, selEncrypt, verifyPassword }  = require('@main_util/security.util');
const { sendMessage }  = require('@main_util/messaging.util');
const { createOtpDTO } = require('@dto/otp.dto');

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
    let response = false;
    const { receiving_medium, use_case, code } = data;

    const encryptedMedium = selEncrypt(receiving_medium, 'receiving_medium');
    
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
            // update otp status to used
            if(!await updateOtpStatus({ receiving_medium, use_case, code })) triggerError("Error occurred while running request", []); // Indicating an internal error occurred
            
            // Check if the OTP has expired (300 seconds = 5 minutes)
            response = isDateLapsed(reg_date, process.env.OTP_EXPIRY) ? 'expired' : true;
        }
    }

    return response;
};

const verifyUsedOtp = async (data) => {
    let response = false;

    const { receiving_medium, use_case, code } = data;
    const encryptedMedium = selEncrypt(receiving_medium, 'receiving_medium');

    // Look for the OTP record based on receiving medium, use case, and status
    const otpRecord = await Otp.findOne({ receiving_medium: encryptedMedium, use_case, status: 'used' });

    if (otpRecord) {
        const { code: dbCode, reg_date } = otpRecord;
        // Verify if the provided code matches the stored one
        if (await verifyPassword(code, dbCode)) {
            response = isDateLapsed(reg_date, process.env.OTP_EXPIRY) ? 'expired' : true;
        }
    }

    return response;
};


// STORE OTP
const storeOtp = async (data) => {
    let result = null;

    const otpData = createOtpDTO(data);
    const { receiving_medium, code, use_case } = otpData;


    result = await Otp.findOneAndUpdate(
        { receiving_medium: selEncrypt(receiving_medium, 'receiving_medium') },
        { code, use_case, status: 'new' },
        { new: true }
    );

    // Insert new OTP if update failed
    if (!result) result = await Otp.create(otpData);
    
    return !!result;
};

// UPDATE OTP
const updateOtpStatus = async (data) => {
    const otpData = createOtpDTO(data);
    const { receiving_medium, code, use_case } = otpData;
    
    return !!await Otp.findOneAndUpdate(
        { receiving_medium: selEncrypt(receiving_medium, 'receiving_medium') },
        { status: 'used' },
        { new: true }
    ); //convert value into boolean 
};

// DELETE OTP
const deleteOtp = async (receiving_medium) => {
    receiving_medium = selEncrypt(receiving_medium, 'receiving_medium');
    return !!await Otp.deleteMany({ receiving_medium }); //convert value into boolean
};

module.exports = {
    sendOtp,
    verifyNewOtp,
    verifyUsedOtp,
    deleteOtp,
};
