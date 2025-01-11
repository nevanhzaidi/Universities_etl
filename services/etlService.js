const axios = require('axios');
const fs = require('fs/promises');
const logger = require('../config/logger');
const { transformUniversities, validateDataset } = require('../models/university');
const { API_URL, DATA_FILE, MAX_RETRIES } = require('../utils/constants');
const { ensureDirectoryExists, wait } = require('../utils/helpers');

const extract = async (retries = MAX_RETRIES) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      logger.error(`API fetch attempt ${attempt} failed:`, error);
      if (attempt === retries) throw error;
      await wait(1000 * attempt);
    }
  }
};

const load = async (data) => {
  try {
    await ensureDirectoryExists(DATA_FILE);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    logger.info(`Data successfully saved to ${DATA_FILE}`);
  } catch (error) {
    logger.error('Error saving data:', error);
    throw error;
  }
};

const performETL = async () => {
  try {
    logger.info('Starting ETL process');
    const rawData = await extract();

    // Validate the entire dataset first
    const datasetValidation = validateDataset(rawData);
    if (!datasetValidation.isValid) {
      logger.warn('Dataset validation issues:', datasetValidation.errors);
    }

    // Transform data - this will now include validation per record
    const transformedData = transformUniversities(rawData);
    
    if (transformedData.length === 0) {
      throw new Error('No valid university data after transformation');
    }

    // Log statistics about the transformation
    logger.info('ETL statistics:', {
      totalRecords: rawData.length,
      validRecords: transformedData.length,
      invalidRecords: rawData.length - transformedData.length
    });

    await load(transformedData);
    logger.info('ETL process completed successfully');
  } catch (error) {
    logger.error('ETL process failed:', error);
    throw error;
  }
};

module.exports = {
  extract,
  load,
  performETL
};