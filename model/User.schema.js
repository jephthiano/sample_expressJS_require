const mongoose = require("mongoose");
const { Schema } = mongoose;

const { hashPassword, selEncrypt, generateUniqueId } = require(MAIN_UTILS + 'security.util');

const UserSchema = new Schema({
    unique_id: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is not specified'],
        trim: true,
    },
    mobile_number: {
        type: String,
        unique: true,
        required: [true, 'mobile number is not specified'],
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'username is not specified'],
        trim: true,
    },
    first_name: {
        type: String,
        required: [true, 'first name is not specified'],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, 'last name is not specified'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is not specified'],
        trim: true,
    },
    transaction_pin: {
        type: String,
        default: null,
        trim: true,
    },
    user_level: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'gender is not specified'],
    },
    dob: {
        type: String,
    },
    address: {
        type: Object,
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
    reg_date: {
        type: Date,
        default: Date.now,
    },
    email_verification: {
        type: Boolean,
        default: false,
    },
    mobile_number_verification: {
        type: Boolean,
        default: false,
    },
    pin_status: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },
    user_account: {
        type: Object,
        default: null,
    },
    user_settings: {
        type: Object,
        default: null,
    },
    user_bank_account: {
        type: Object,
        default: null,
    },
    user_kyc_data: {
        type: Object,
        default: null,
    },
    user_ext_data: {
        type: Object,
        default: null,
    },
});

// ✅ Pre-save hook
UserSchema.pre('save', async function (next) {
    this.unique_id = "user" + generateUniqueId(10);

    if (this.isModified('email')) {
        this.email = selEncrypt(this.email.toLowerCase(), 'email');
    }
    if (this.isModified('mobile_number')) {
        this.mobile_number = selEncrypt(this.mobile_number, 'mobile_number');
    }
    if (this.isModified('username')) {
        this.username = selEncrypt(this.username.toLowerCase(), 'username');
    }
    if (this.isModified('first_name')) {
        this.first_name = selEncrypt(this.first_name.toLowerCase(), 'first_name');
    }
    if (this.isModified('last_name')) {
        this.last_name = selEncrypt(this.last_name.toLowerCase(), 'last_name');
    }

    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }

    this.user_account = { balance: "0.00" };
    next();
});

// ✅ Pre-update hooks
UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.password) {
        update.password = await hashPassword(update.password);
    }

    // Encrypt email, mobile, etc. if present (optional)
    if (update.email) update.email = selEncrypt(update.email.toLowerCase(), 'email');
    if (update.mobile_number) update.mobile_number = selEncrypt(update.mobile_number, 'mobile_number');
    if (update.username) update.username = selEncrypt(update.username.toLowerCase(), 'username');
    if (update.first_name) update.first_name = selEncrypt(update.first_name.toLowerCase(), 'first_name');
    if (update.last_name) update.last_name = selEncrypt(update.last_name.toLowerCase(), 'last_name');

    this.setUpdate(update);
    next();
});

UserSchema.pre('findByIdAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.password) {
        update.password = await hashPassword(update.password);
    }

    this.setUpdate(update);
    next();
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
