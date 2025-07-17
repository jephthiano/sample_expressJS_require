require("dotenv").config(); // Load environment variables
require('module-alias/register');
const express = require("express");
const app = express();

require('@config/applyMiddleware')(app); // Apply middlewares

const { connectDB, mongoose } = require('@config/database'); // Import both
const v1RouteEntry = require('@route/v1/index.rou'); // Route entry point
const { log } = require('@main_util/logger.util');

connectDB().then(() => {
    app.use("/api/v1", v1RouteEntry);
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => log('ENTRY POINT', `🚀 Server running on port ${PORT}`, 'info'));

    // Graceful shutdown on Ctrl+C or system kill
    process.on("SIGINT", async () => {
        const server = app.listen(PORT, () => log('ENTRY POINT', `🛑 Shutting down server...`, 'error'));
        await mongoose.disconnect(); // Now `mongoose` is available
        server.close(() => process.exit(0));
    });
});