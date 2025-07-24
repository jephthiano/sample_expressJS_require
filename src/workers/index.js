require('module-alias/register');
require('@config/env');
const { connectDB, mongoose } = require('@config/database');
const { log } = require('@main_util/logger.util');

// workers
require('@worker/messagingWorker');
require('@worker/rehashWorker');
require('@worker/deleteOtpWorker');

// Connect DB and manage graceful shutdown
connectDB().then(() => {
    log('WORKER ENTRY POINT', '✅ Workers initialized and DB connected', 'info');

    process.on('SIGINT', async () => {
        log('WORKER ENTRY POINT', '🛑 Shutting down worker process...', 'error');
        await mongoose.disconnect();
        process.exit(0);
    });
});