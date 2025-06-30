require('module-alias/register');
const { redis } = require('@config/database');
const { Worker } = require('bullmq');
// const { rehashUserPassword } = require('@main_util/security.util');
const { updateSingleField } = require('@main_util/database.util');

// Create the worker
const worker = new Worker(
  'rehashQueue',
  async (job) => {
    try {

      const data = job.data.data
      await updateSingleField('User', 'id', data.userId, 'password', data.plainPassword);

      // await rehashUserPassword(job.data.data);
    } catch (err) {
      console.error(`Error rehashing password: ${err.message}`);
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