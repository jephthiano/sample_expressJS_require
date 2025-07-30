const { redis } = require('#config/redis'); 
const { Worker } = require('bullmq');
const { sendMessage } = require('#main_util/messaging.util');
const { log } = require('#main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

// Create the worker
const worker = new Worker(
  'messagingQueue',
  async (job) => {
    try {
      await sendMessage(job.data.data);
    } catch (err) {
      logInfo('MESSAGING WORKER', `Error sending message: ${err.message}`);
      throw err; // ensure BullMQ registers it as a failure
    }
  },
  {
    connection: redis.duplicate(), // ensure isolated connection
    // concurrency: 5, // optional
  }
);


// Error handler
worker.on('failed', (job, err) => {
  logError('MESSAGING WORKER', `❌ Job failed for ${job?.data?.data?.send_medium || 'unknown'}: ${err.message}`);
});

worker.on('completed', (job) => {
  logInfo('MESSAGING WORKER', `🎉 Job completed: ${job.id}`);
});