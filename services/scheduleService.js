const cron = require('node-cron');
const logger = require('../config/logger');
const { performETL } = require('./etlService');
const { CRON_SCHEDULE } = require('../utils/constants');

const initializeScheduler = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info('Running scheduled ETL job');
    await performETL();
  });
};

module.exports = {
  initializeScheduler
};