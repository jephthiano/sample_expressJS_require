const { Queue, Worker } = require('bullmq');
const { sendMessage }  = require(MAIN_UTILS + 'messaging.util');
require('dotenv').config();

const connection = {
host: process.env.REDIS_HOST,
port: parseInt(process.env.REDIS_PORT)
};

const emailQueue = new Queue('messagingQueue', { connection });

async function queueEmail(data, send_medium) {
    await emailQueue.add('sendMessage', { data, send_medium });
}

module.exports = { queueEmail };