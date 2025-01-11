const express = require('express');
const logger = require('./config/logger');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const { performETL } = require('./services/etlService');
const { initializeScheduler } = require('./services/scheduleService');
const { PORT } = require('./utils/constants');

const app = express();

// Middleware
app.use(express.json());
app.use('/api', apiRoutes);
app.use(errorHandler);

// Initialize application
const initializeApp = async () => {
  try {
    // Run initial ETL
    await performETL();
    
    // Start cron job
    initializeScheduler();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

initializeApp();