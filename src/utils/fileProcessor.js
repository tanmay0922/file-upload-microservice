// src/utils/fileProcessor.js
const fs = require('fs');
const crypto = require('crypto');

exports.extractData = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
};
