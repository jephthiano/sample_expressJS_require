require('module-alias/register');
require('#config/env');
const { connectDB, mongoose } = require('#config/database'); // Import both
const { log } = require('#main_util/logger.util');
const { getEnvorThrow } = require('#main_util/general.util');
const app = require('#src/app');

const PORT = getEnvorThrow('PORT');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      log('SERVER ENTRY POINT', `🚀 Server running on port ${PORT}`, 'info');
    });

    process.on('SIGINT', async () => {
      log('SERVER ENTRY POINT', '🛑 Shutting down server...', 'error');
      await mongoose.disconnect();
      server.close(() => process.exit(0));
    });

  } catch (err) {
    log('SERVER ENTRY POINT', `❌ Failed to start server: ${err.message}`, 'error');
    process.exit(1);
  }
};

startServer();