require('module-alias/register');
require('@config/env');
const { connectDB, mongoose } = require('@config/database');
const { log } = require('@main_util/logger.util');

// workers
require('@worker/messagingWorker');
require('@worker/rehashWorker');
require('@worker/deleteOtpWorker');

connectDB().then(() => {

    // Graceful shutdown on Ctrl+C or system kill
    process.on("SIGINT", async () => {
        log('ENTRY POINT', `🛑 Shutting down server...`, 'error')
        await mongoose.disconnect(); // Now `mongoose` is available
        server.close(() => process.exit(0));
    });
});