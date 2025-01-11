const fs = require('fs/promises');
const path = require('path');

const ensureDirectoryExists = async (filePath) => {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  ensureDirectoryExists,
  wait
};