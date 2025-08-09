const mongoose = require("mongoose");
const { Schema } = mongoose;

const { selEncrypt, hashPassword } = require('#main_util/security.util');

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
// Reusable transformer for update objects
async function transformOtpUpdate(update) {
    const target = update.$set || update;

    // Only hash if it's a plain string (avoid re-hashing)
    if (target.code && !target.code.startsWith('$2b$')) {
        target.code = await hashPassword(target.code);
    }

    if (target.receiving_medium && !target.receiving_medium.startsWith('enc:')) {
        target.receiving_medium = selEncrypt(target.receiving_medium, 'receiving_medium');
    }

    target.reg_date = new Date();

    if (update.$set) {
        update.$set = target;
    } else {
        Object.assign(update, target);
    }

    return update;
}

// Pre-save
OtpTokenSchema.pre('save', async function (next) {
    if (this.isModified('code') && !this.code.startsWith('$2b$')) {
        this.code = await hashPassword(this.code);
    }

    if (this.isModified('receiving_medium') && !this.receiving_medium.startsWith('enc:')) {
        this.receiving_medium = selEncrypt(this.receiving_medium, 'receiving_medium');
    }

    next();
});

// Update hooks
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'];

updateHooks.forEach((hook) => {
    UserSchema.pre(hook, async function (next) {
        const update = this.getUpdate();
        await transformOtpUpdate(update);// call the transform logic
        this.setUpdate(update); // replace the olf value with the new one
        next();
    });
});

const OtpToken = mongoose.model('OtpTokens', OtpTokenSchema);
module.exports = OtpToken;
