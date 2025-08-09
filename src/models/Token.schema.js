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


// Reusable transformer for update objects
async function transformTokenUpdate(update) {
    const target = update.$set || update;

    if (target.token) {
        target.token = selEncrypt(target.token, 'token');
        target.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }

    if (update.$set) update.$set = target;
    else Object.assign(update, target);

    return update;
}

// Pre-save
TokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        this.token = selEncrypt(this.token, 'token');
        this.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }
    next();
});

// Update hooks
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'];

updateHooks.forEach((hook) => {
    UserSchema.pre(hook, async function (next) {
        const update = this.getUpdate();
        await transformTokenUpdate(update);// call the transform logic
        this.setUpdate(update); // replace the olf value with the new one
        next();
    });
});

const Token = mongoose.model('tokens', TokenSchema);
module.exports = Token;
