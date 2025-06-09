const { Queue } = require('bullmq');
const redis = require(CONFIGS + 'database.js'); // this should export an ioredis instance
require('dotenv').config();

const messagingQueue = new Queue('messagingQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds an email job to the messaging queue.
 *
 * @param {Object} data - The message payload.
 * @param {string} send_medium - The channel (e.g., 'email', 'sms').
 */
async function queueMessagingl(data, send_medium) {
  await messagingQueue.add('sendMessage', {
    data,
    send_medium,
  });
}

module.exports = { queueEmail };
