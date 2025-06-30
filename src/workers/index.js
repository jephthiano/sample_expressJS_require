require('module-alias/register');

//db connection
const { connectDB, mongoose } = require('@config/database'); // Import both


connectDB().then(() => {
    // workers
    require('@worker/messagingWorker');
    require('@worker/rehashWorker');

    // Graceful shutdown on Ctrl+C or system kill
    process.on("SIGINT", async () => {
        console.log("🛑 Shutting down server...");
        await mongoose.disconnect(); // Now `mongoose` is available
        server.close(() => process.exit(0));
    });
});