// src/files/files.routes.js
const express = require('express');
const { uploadFile, getFileStatus } = require('./files.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

// Route for file upload
router.post('/upload', authenticate, uploadFile);

// Route for fetching the status of a file
router.get('/:id', authenticate, getFileStatus);

module.exports = router;
