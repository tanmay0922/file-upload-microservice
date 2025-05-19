// server.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/auth/auth.routes');
const fileRoutes = require('./src/files/files.routes');
const sequelize = require('./src/config/db.config');
const jobWorker = require('./src/jobs/job.worker');

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Health check route to ensure server is running
app.get('/health', (req, res) => {
  res.send('Server is running');
});

// Authentication routes
app.use('/auth', authRoutes);

// File upload routes
app.use('/files', fileRoutes);

// Sync the database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Start the background job worker
// This will ensure that jobs are picked up and processed
jobWorker;
