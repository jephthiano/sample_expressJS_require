const mongoose = require("mongoose");
const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
        // log('DB Connection [MAIN UTIL]',`Database connected: ${conn.connection.host}`,'info')
        console.log(`✅ Database connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
        // log('DB Connection [MAIN UTIL]',`Error occurred while connecting to the database`,'error')
        console.log("Error occurred while connecting to the database");
        process.exit(1); // Exit process if DB connection fails
    }
};
module.exports = { connectDB, mongoose }; // Export both the connection function and mongoose
