require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

module.exports = function (app) {
    const corsOptions = {
        origin: process.env.CLIENT_URL,
        allowedHeaders: "",
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    };
    
    const Request = require(MAIN_UTILS + 'request.util');
    
    // Set rate limit message
    const message = JSON.stringify({ status: false, "message": "Too many requests from this IP, please try again later." });
    
    // Define rate limit rule
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: message
    });
    
    // Apply middlewares
    app.use(cors(corsOptions)); // Set CORS
    app.use(cookieParser()); // Cookie parser
    app.use(limiter); // Set rate-limiting
    app.use(express.json()); // JSON parsing
    app.use(helmet()); // Set Helmet for security
    app.use(xss()); // Set express XSS protection
    app.use(mongoSanitize()); // Set express Mongo sanitize
    // app.use(Request.setInputData);
};
