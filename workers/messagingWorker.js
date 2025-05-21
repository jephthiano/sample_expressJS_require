const { Worker } = require('bullmq');
const { sendMessage }  = require(MAIN_UTILS + 'messaging.util');
require('dotenv').config();

const worker = new Worker('emailQueue', async job => {
    await sendMessage(job.data);
    console.log(`Email sent to ${job.data.receiving_medium}`);
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});

worker.on('failed', (job, err) => {
    console.error(`Failed to send message to ${job.data.receiving_medium}: ${err.message}`);
});