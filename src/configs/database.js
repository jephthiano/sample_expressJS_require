const mongoose = require("mongoose");
const { log } = require('#main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            logError("DATABASE CONFIG", `MONGODB_URI is not set in defined`);
            throw new Error('Error occured on the server.');
        }
        const conn = await mongoose.connect(uri);
        logInfo("DATABASE CONFIG", `✅ Database connected: ${conn.connection.host}`);
    } catch (err) {
        logError("DATABASE CONFIG", `❌ Error connecting to the database: ${err}`);
        process.exit(1); // Exit process if DB connection fails
    }
};

module.exports = { 
    connectDB, 
    mongoose,
}; 
