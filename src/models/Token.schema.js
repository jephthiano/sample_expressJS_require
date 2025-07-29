const mongoose = require("mongoose");
const { Schema } = mongoose;
const { selEncrypt } = require('#main_util/security.util');

const TokenSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },

    token: {
        type: String,
        unique: true,
        required: true
    },

    expire_at: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        index: { expires: 0 }
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

async function transformUserUpdate(update) {
    const target = update.$set || update;

    if (target.token) {
        target.token = selEncrypt(target.token, 'token');
        target.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }

    if (update.$set) update.$set = target;
    else Object.assign(update, target);

    return update;
}

TokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        this.token = selEncrypt(this.token, 'token');
        this.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }
    next();
});

['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'].forEach(hook => {
    TokenSchema.pre(hook, async function (next) {
        const update = this.getUpdate();
        await transformUserUpdate(update);
        this.setUpdate(update);
        next();
    });
});

const Token = mongoose.model('tokens', TokenSchema);
module.exports = Token;
