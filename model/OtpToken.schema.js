const { mongoose } = require(CONFIGS + "database");
const { Schema } = mongoose;

const { hashPassword } = require(MAIN_UTILS + 'security.util');

const OtpTokenSchema = new Schema({
    receiving_medium: { 
        type : String,
        unique : true,
        required : [true, 'receiving medium is not specified'],
        trim : true 
    },
    code: { 
        type : String,
        unique : true,
        required : [true, 'code is not specified'],
        trim : true 
    },
    use_case: { 
        type : String,
        enum : ['register', 'forgot_password', 'verify_email', 'verify_mobile_number'],
        required : [true, 'use case is not specified'],
    },
    status: { 
        type : String,
        enum : ['new','used'],
        default : 'new'
    },
    reg_date: { 
        type : Date, 
        default : Date.now()
    }
});

OtpTokenSchema.pre('save', function(next) {
    //hash code
    if (this.isModified('code')) {
        this.code = hashPassword(this.code)
    }
    next();
  });

OtpTokenSchema.pre('findOneAndUpdate', function (next) {
    //hash code
    if (this.getUpdate().code) {
        this.getUpdate().code = hashPassword(this.getUpdate().code)
    }
    
    //update reg_date
    this.set({ reg_date: new Date() });
    next();
});

const OtpToken = mongoose.model('OtpTokens', OtpTokenSchema);

module.exports = OtpToken;