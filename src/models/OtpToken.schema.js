const mongoose = require("mongoose");
const { Schema } = mongoose;

const { selEncrypt, hashPassword } = require('@main_util/security.util');

// Define Schema
const OtpTokenSchema = new Schema({
    receiving_medium: { 
        type: String,
        unique: true,
        required: [true, 'receiving medium is not specified'],
        trim: true 
    },
    code: { 
        type: String,
        unique: true,
        required: [true, 'code is not specified'],
        trim: true 
    },
    use_case: { 
        type: String,
        enum: ['sign_up', 'forgot_password', 'verify_email', 'verify_mobile_number'],
        required: [true, 'use case is not specified'],
    },
    status: { 
        type: String,
        enum: ['new', 'used'],
        default: 'new'
    },
    reg_date: { 
        type: Date, 
        default: Date.now
    }
});

// 🔄 Shared transformation logic
async function transformOtpUpdate(update) {
    const data = update.$set || update;

    // Only hash if it's a plain string (avoid re-hashing)
    if (data.code && !data.code.startsWith('$2b$')) {
        data.code = await hashPassword(data.code);
    }

    if (data.receiving_medium && !data.receiving_medium.startsWith('enc:')) {
        data.receiving_medium = selEncrypt(data.receiving_medium, 'receiving_medium');
    }

    data.reg_date = new Date();

    if (update.$set) {
        update.$set = data;
    } else {
        Object.assign(update, data);
    }

    return update;
}

// ✅ Pre-save for new entries
OtpTokenSchema.pre('save', async function (next) {
    if (this.isModified('code') && !this.code.startsWith('$2b$')) {
        this.code = await hashPassword(this.code);
    }

    if (this.isModified('receiving_medium') && !this.receiving_medium.startsWith('enc:')) {
        this.receiving_medium = selEncrypt(this.receiving_medium, 'receiving_medium');
    }

    next();
});

// ✅ For all update operations
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany'];
updateHooks.forEach(hook => {
    OtpTokenSchema.pre(hook, async function (next) {
        const update = this.getUpdate();
        await transformOtpUpdate(update);
        this.setUpdate(update);
        next();
    });
});

const OtpToken = mongoose.model('OtpTokens', OtpTokenSchema);
module.exports = OtpToken;
