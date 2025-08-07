const User = require('#model/User.schema');
const OtpToken = require('#model/OtpToken.schema');
const Token = require('#model/Token.schema');
const { triggerError} = require('#core_util/handler.util');

const findSingleValue = async (collectionName, field, param, select) => {
    const model = getModel(collectionName); // Get model dynamically
    if (!model) triggerError(`Error occurred on the server`,[], 500);

    const result = await model.findOne({ [field]: param }, select);
    const response = result ? result[select] : null;

    return response;
};

const updateSingleField = async (collectionNameectionName, whereField, whereValue, updateField, newValue) => {
    const model = getModel(collectionName); // dynamically resolve the Mongoose model
    if (!model) triggerError(`Error occurred on the server`,[], 500);

    const result = await model.updateOne(
    { [whereField]: whereValue },
    { $set: { [updateField]: newValue } }
    );

    return result.modifiedCount > 0;
};

const getModel = (modelName) => {
    const models = { User, OtpToken, Token }; // Add other models here
    return models[modelName] || null;
};

module.exports = { 
    findSingleValue,
    updateSingleField
};