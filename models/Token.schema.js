const mongoose = require("mongoose");
const { Schema } = mongoose;
const { hashPassword } = require(MAIN_UTILS + 'security.util');

const TokenSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,

    token: String,

    expireAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index triggers expiration
  }
});

// Reusable transformer for update objects
async function transformUserUpdate(update) {
    const target = update.$set || update;

    if (target.token) target.token = await hashPassword(target.token);

    if (update.$set) update.$set = target;
    else Object.assign(update, target);

    return update;
}


// Pre-save
TokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) this.password = await hashPassword(this.token);

    next();
});


// Update hooks
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'];

updateHooks.forEach((hook) => {
    TokenSchema.pre(hook, async function (next) {
        const update = this.getUpdate();
        await transformUserUpdate(update);
        this.setUpdate(update);
        next();
    });
});


const Token = mongoose.model('tokens', TokenSchema);
module.exports = Token;