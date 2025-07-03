require('module-alias/register');
const { connectDB, mongoose } = require('@config/database');
const { log } = require('@main_util/logger.util');


connectDB().then(() => {
    // workers
    require('@worker/messagingWorker');
    require('@worker/rehashWorker');

    // Graceful shutdown on Ctrl+C or system kill
    process.on("SIGINT", async () => {
        log('ENTRY POINT', `🛑 Shutting down server...`, 'error')
        await mongoose.disconnect(); // Now `mongoose` is available
        server.close(() => process.exit(0));
    });
});