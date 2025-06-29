require('module-alias/register');
const { redis } = require('@config/database');
const { Worker } = require('bullmq');
const { rehashUserPassword } = require('@main_util/security.util');

// Create the worker
const worker = new Worker(
  'rehashQueue',
  async (job) => {
    try {
      await rehashUserPassword(job.data.data);
    } catch (err) {
      console.error(`Error sending message: ${err.message}`);
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
  console.error(`❌ Job failed for ${job?.data?.data?.send_medium || 'unknown'}: ${err.message}`);
});

worker.on('completed', (job) => {
  console.log(`🎉 Job completed: ${job.id}`);
});