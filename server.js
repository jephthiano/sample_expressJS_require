require('module-alias/register');
require('@config/env');
const express = require("express");
const app = express();

require('@config/applyMiddleware')(app); // Apply middlewares

const { connectDB, mongoose } = require('@config/database'); // Import both
const v1RouteEntry = require('@route/v1/index.rou'); // Route entry point
const { log } = require('@main_util/logger.util');

const startServer = async () => {
  try {
    await connectDB();

    app.use('/api/v1', v1RouteEntry);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      log('ENTRY POINT', `🚀 Server running on port ${PORT}`, 'info');
    });

    process.on('SIGINT', async () => {
      log('ENTRY POINT', '🛑 Shutting down server...', 'error');
      await mongoose.disconnect();
      server.close(() => process.exit(0));
    });

  } catch (err) {
    log('ENTRY POINT', `❌ Failed to start server: ${err.message}`, 'error');
    process.exit(1);
  }
};

startServer();