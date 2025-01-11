const fs = require('fs/promises');
const json2csv = require('json2csv');
const logger = require('../config/logger');
const { DATA_FILE } = require('../utils/constants');

const handleCSVDownload = async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    const universities = JSON.parse(fileData);

    const fields = ['name', 'country', 'state', 'domain', 'website', 'countryCode', 'lastUpdated'];
    const csv = json2csv.parse(universities, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=universities.csv');
    res.send(csv);
  } catch (error) {
    logger.error('Error generating CSV:', error);
    res.status(500).send('Error generating CSV file');
  }
};

module.exports = {
  handleCSVDownload
};