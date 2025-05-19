// src/files/file.model.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const File = sequelize.define('File', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // Ensure the 'users' table exists
      key: 'id',
    },
    allowNull: false,
  },
  original_filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storage_path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'uploaded', // Possible values: 'uploaded', 'processing', 'processed', 'failed'
    validate: {
      isIn: [['uploaded', 'processing', 'processed', 'failed']],
    },
  },
  extracted_data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  uploaded_at: {
    type: DataTypes.TIMESTAMP,
    defaultValue: Sequelize.NOW,
  },
});

// Ensure the table is created if it doesn't already exist
File.sync();

module.exports = { File };
