const User = require('@model/User.schema');
const { log } = require('@main_util/logger.util');
const { triggerError} = require('@core_util/handler.util');

const findSingleValue = async (coll, field, param, select) => {
    const model = getModel(coll); // Get model dynamically
    if (!model) triggerError(`Model ${coll} not found`);

    const result = await model.findOne({ [field]: param }, select);
    const response = result ? result[select] : null;

    return response;
};

const updateSingleField = async (collectionName, whereField, whereValue, updateField, newValue) => {
    const model = getModel(collectionName); // dynamically resolve the Mongoose model
    if (!model) triggerError(`Model ${coll} not found`);

    const result = await model.updateOne(
    { [whereField]: whereValue },
    { $set: { [updateField]: newValue } }
    );

    return result.modifiedCount > 0;
};

const getModel = (modelName) => {
    const models = { User }; // Add other models here
    return models[modelName] || null;
};

module.exports = { 
    findSingleValue,
    updateSingleField
};