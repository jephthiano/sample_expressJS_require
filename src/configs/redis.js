const Redis = require('ioredis');
const { log } = require('#main_util/logger.util');
const { getEnvorThrow } = require('#main_util/general.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

const RAW_PORT = getEnvorThrow('REDIS_PORT');
const REDIS_HOST = getEnvorThrow('REDIS_HOST');
// const REDIS_PASSWORD = getEnvorThrow('REDIS_PASSWORD');


const REDIS_PORT = Number(RAW_PORT);
if (isNaN(REDIS_PORT)) logError('REDIS', `Invalid REDIS_HOST value: ${RAW_PORT}`);

const redis = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  maxRetriesPerRequest: null,
  // password: REDIS_PASSWORD, // if needed
});

logInfo('REDIS', `Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = { redis }; 
