require('dotenv').config();
const mongoose = require("mongoose");
const Redis = require('ioredis');
const { log } = require('@main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logInfo("DATABASE CONFIG", `✅ Database connected: ${conn.connection.host}`);
    } catch (err) {
        logError("DATABASE CONFIG", `❌ Error connecting to the database: ${err}`);
        process.exit(1); // Exit process if DB connection fails
    }
};

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  // password: process.env.REDIS_PASSWORD, // if needed
});

module.exports = { 
    connectDB, 
    mongoose,
    redis,
}; 
