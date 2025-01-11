const path = require('path');

module.exports = {
  API_URL: 'http://universities.hipolabs.com/search?country=United+States',
  DATA_FILE: path.join(__dirname, '../data/universities.json'),
  PORT: process.env.PORT || 3000,
  CRON_SCHEDULE: '0 0 * * *', // Midnight UTC
  MAX_RETRIES: 3
};