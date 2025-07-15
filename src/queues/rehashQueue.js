const { Queue } = require('bullmq');
const { redis } = require('@config/database');

const rehashQueue = new Queue('rehashQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds job to the rehash queue.
 *
 * @param {Object} data - The message payload.
 */
async function queueRehash(data) {
  await rehashQueue.add('rehashPassword', { data });
}

module.exports = { queueRehash };