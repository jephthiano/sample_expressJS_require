const Redis = require('ioredis');
const { log } = require('@main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  // password: process.env.REDIS_PASSWORD, // if needed
});

module.exports = { redis }; 
