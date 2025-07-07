require('module-alias/register');
const { redis } = require('@config/database');
const { Worker } = require('bullmq');
const { updateSingleField } = require('@main_util/database.util');
const { log } = require('@main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

// Create the worker
const worker = new Worker(
  'rehashQueue',
  async (job) => {
    try {
      const data = job.data.data
      await updateSingleField('User', 'id', data.userId, 'password', data.plainPassword);
    } catch (err) {
      logInfo('REHASH WORKER', `Error rehashing password: ${err.message}`);
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
  logError('REHASH WORKER', `❌ Job failed for rehashing: ${err.message}`);
});

worker.on('completed', (job) => {
  logInfo('REHASH WORKER', `🎉 Job completed: ${job.id}`);
});