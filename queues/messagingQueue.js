const { Queue } = require('bullmq');
const { redis } = require(CONFIGS + 'database.js');
require('dotenv').config();

const messagingQueue = new Queue('messagingQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds an email job to the messaging queue.
 *
 * @param {Object} data - The message payload.
 */
async function queueMessaging(data, send_medium) {
  await messagingQueue.add('sendMessage', { data });
}

module.exports = { queueMessaging };
