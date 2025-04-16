const mongoose = require("mongoose");
const { log } = require(MAIN_UTILS + 'logger.util');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
        log('DB Connection [MAIN UTIL]',`Database connected: ${conn.connection.host}`,'info')
        console.log(`✅ Database connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
        log('DB Connection [MAIN UTIL]',`Error occurred while connecting to the database`,'error')
        console.log("Error occurred while connecting to the database");
        process.exit(1); // Exit process if DB connection fails
    }
};

const findSingleValue = async (coll, field, param, select) => {
    let response = false;
    try {
        const model = getModel(coll); // Get model dynamically
        if (!model) throw new Error(`Model ${coll} not found`);

        const result = await model.findOne({ [field]: param }, select);
        if (result) response = result[select];
    } catch (err) {
        // logError("findSingleValue [DATABASE FUNCTION]", err);
    }
    return response;
};

/**
 * Get a Mongoose model dynamically
 * @param {string} modelName - Name of the model
 * @returns {mongoose.Model | null} - Returns Mongoose model or null if not found
 */
const getModel = (modelName) => {
    const models = { User }; // Add other models here
    return models[modelName] || null;
};

module.exports = { connectDB, mongoose, findSingleValue }; // Export both the connection function and mongoose
