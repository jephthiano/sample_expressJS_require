const User = require('@model/User.schema');

const findUserByID = async (userId) => {
    return awaitUser.findOne({ _id: userId});
}

const find

module.exports = {
    findUserByID,
};