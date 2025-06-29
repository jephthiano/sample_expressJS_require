require("dotenv").config(); // Load environment variables
require('module-alias/register');
const express = require("express");
const app = express();

require('@config/global')(); // Initialize global variables
require('@config/middleware')(app); // Apply middlewares

const { connectDB, mongoose } = require("./configs/database"); // Import both
const v1RouteEntry = require(ROUTES + "v1/index.rou"); // Route entry point


connectDB().then(() => {
    app.use("/api/v1", v1RouteEntry);
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Graceful shutdown on Ctrl+C or system kill
    process.on("SIGINT", async () => {
        console.log("🛑 Shutting down server...");
        await mongoose.disconnect(); // Now `mongoose` is available
        server.close(() => process.exit(0));
    });
});