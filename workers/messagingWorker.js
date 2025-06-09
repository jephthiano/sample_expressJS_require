require("../configs/global")(); // Initialize global variables
const { Worker } = require('bullmq');
const { sendMessage } = require(MAIN_UTILS + 'messaging.util');
const { redis } = require(CONFIGS + 'database.js');

// Create the worker
const worker = new Worker(
  'messagingQueue',
  async (job) => {
    // const payload = sendMessageDTO(job.data);
    try {
      await sendMessage(job.data);
      console.log(`Message sent to ${job.data.send_medium || job.data.receiving_medium}`);
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
  console.error(`❌ Job failed for ${job?.data?.send_medium || 'unknown'}: ${err.message}`);
});

worker.on('completed', (job) => {
  console.log(`🎉 Job completed: ${job.id}`);
});
