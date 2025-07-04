const User = require('@model/User.schema');
const { log } = require('@main_util/logger.util');

const findSingleValue = async (coll, field, param, select) => {
    let response = false;
    try {
        const model = getModel(coll); // Get model dynamically
        if (!model) throw new Error(`Model ${coll} not found`);

        const result = await model.findOne({ [field]: param }, select);
        if (result) response = result[select];
    } catch (err) {
        log("findSingleValue [DATABASE FUNCTION]", err, 'error');
    }
    return response;
};

const updateSingleField = async (collectionName, whereField, whereValue, updateField, newValue) => {
  try {
        const model = getModel(collectionName); // dynamically resolve the Mongoose model
        if (!model) throw new Error(`Model '${collectionName}' not found`);

        const result = await model.updateOne(
        { [whereField]: whereValue },
        { $set: { [updateField]: newValue } }
        );

        return result.modifiedCount > 0;
  } catch (err) {
        log(`updateSingleField [DATABASE FUNCTION]`, err, 'error');
        return false;
  }
};

const getModel = (modelName) => {
    const models = { User }; // Add other models here
    return models[modelName] || null;
};

module.exports = { 
    findSingleValue,
    updateSingleField
};