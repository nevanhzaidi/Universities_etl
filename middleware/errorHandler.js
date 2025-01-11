const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;