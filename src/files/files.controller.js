// src/files/files.controller.js
const multer = require('multer');
const path = require('path');
const { File } = require('./file.model');
const { Queue } = require('bullmq');
const { redisClient } = require('../config/redis.config');
const { enqueueFileProcessingJob } = require('../auth/jobs/job.worker');

// Set up Multer for file upload
const upload = multer({
  dest: './uploads/',  // Store the uploaded files in the 'uploads' directory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']; // Allowed file types
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and TXT files are allowed.'));
    }
  },
});

// Set up the BullMQ queue for file processing
const queue = new Queue('file-processing', {
  redis: { client: redisClient },
});

// File upload controller
exports.uploadFile = [upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Save file metadata in the database
    const newFile = await File.create({
      user_id: req.userId,  // Get the user ID from the authenticated request
      original_filename: file.originalname,
      storage_path: file.path,
      title,
      description,
      status: 'uploaded',
    });

    // Enqueue the background job for file processing
    await enqueueFileProcessingJob(newFile.id);

    // Return response with file ID and status
    res.status(201).json({
      fileId: newFile.id,
      status: 'uploaded',
      message: 'File uploaded successfully.',
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file.');
  }
}];

// File status controller (GET /files/:id)
exports.getFileStatus = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch file metadata based on file ID and user ID (only allow access to files uploaded by the authenticated user)
    const file = await File.findOne({
      where: { id, user_id: req.userId },
    });

    if (!file) {
      return res.status(404).send('File not found.');
    }

    // Return file metadata, status, and extracted data (if available)
    res.json({
      fileId: file.id,
      original_filename: file.original_filename,
      title: file.title,
      description: file.description,
      status: file.status,
      extracted_data: file.extracted_data,
      uploaded_at: file.uploaded_at,
    });
  } catch (err) {
    console.error('Error fetching file status:', err);
    res.status(500).send('Error fetching file status.');
  }
};
