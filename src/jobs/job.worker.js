// src/jobs/job.worker.js
const { Worker } = require('bullmq');
const { File } = require('../../files/file.model');
const { extractData } = require('../utils/fileProcessor');
const { redisClient } = require('../config/redis.config');

const worker = new Worker(
  'file-processing',
  async job => {
    const file = await File.findByPk(job.id);
    if (!file) throw new Error('File not found');

    // Simulate file processing (e.g., checksum calculation)
    const result = await extractData(file.storage_path);

    // Update file status and save extracted data
    await file.update({
      status: 'processed',
      extracted_data: result,
    });

    console.log('Processing completed for file:', file.id);
    return result;
  },
  {
    redis: { client: redisClient },
    limiter: { groupKey: 'file-processing', max: 10, duration: 1000 },
  }
);

worker.on('completed', job => {
  console.log('Job completed:', job.id);
});

worker.on('failed', (job, err) => {
  console.error('Job failed:', job.id, err);
});

module.exports = worker;
