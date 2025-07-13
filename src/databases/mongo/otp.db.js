const Otp = require('@model/OtpToken.schema');
const { createOtpDTO } = require('@dto/otp.dto');
const { selEncrypt }  = require('@main_util/security.util');

//FIND ONE OTP DATA
const findOneOtpData = async(receiving_medium, use_case, status) => {
    receiving_medium = selEncrypt(receiving_medium, 'receiving_medium');
    // Look for the OTP record based on receiving medium, use case, and status
    return await Otp.findOne({ receiving_medium, use_case,  status });
}

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
    const { receiving_medium, use_case } = otpData;
    
    return !!await Otp.findOneAndUpdate(
        { receiving_medium: selEncrypt(receiving_medium, 'receiving_medium'), use_case },
        { status: 'used' },
        { new: true }
    ); //convert value into boolean 
};

const deleteManyOtp = async (receiving_medium) => {
    return !!await Otp.deleteMany({ receiving_medium: selEncrypt(receiving_medium, 'receiving_medium') }); //convert value into boolean
}


module.exports = {
    findOneOtpData,
    storeOtp,
    updateOtpStatus,
    deleteManyOtp,
};
