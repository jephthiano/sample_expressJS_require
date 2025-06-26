require("../configs/global")(); // Initialize global variables
const { redis } = require(CONFIGS + 'database.js');
const { Worker } = require('bullmq');
const { sendMessage } = require(MAIN_UTILS + 'messaging.util');

// Create the worker
const worker = new Worker(
  'messagingQueue',
  async (job) => {
    try {
      await sendMessage(job.data.data);
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