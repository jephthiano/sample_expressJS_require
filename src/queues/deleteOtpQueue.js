const { Queue } = require('bullmq');
const { redis } = require('@config/database');

const deleteOtpQueue = new Queue('deleteOtpQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds job to the rehash queue.
 *
 * @param {Object} data - The message payload.
 */
async function queueDeleteOtp(data) {
  await deleteOtpQueue.add('deleteOtp', { data });
}

module.exports = { queueDeleteOtp };