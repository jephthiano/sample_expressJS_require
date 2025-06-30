require('dotenv').config();
const mongoose = require("mongoose");
const Redis = require('ioredis');
const { log } = require('@main_util/logger.util');

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
