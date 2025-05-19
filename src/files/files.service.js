// src/files/files.service.js
const { File } = require('./file.model');
const { Sequelize } = require('sequelize');

class FileService {
  // Get file by ID and ensure the user has access to it
  static async getFileById(fileId, userId) {
    try {
      const file = await File.findOne({
        where: { id: fileId, user_id: userId }, // Check ownership
      });

      if (!file) {
        throw new Error('File not found or unauthorized access');
      }

      return file;
    } catch (error) {
      throw new Error('Error fetching file: ' + error.message);
    }
  }

  // Update file status
  static async updateFileStatus(fileId, status, extractedData = null) {
    try {
      const file = await File.findByPk(fileId);
      
      if (!file) {
        throw new Error('File not found');
      }

      await file.update({
        status: status,
        extracted_data: extractedData,
      });

      return file;
    } catch (error) {
      throw new Error('Error updating file status: ' + error.message);
    }
  }

  // Create a new file record
  static async createFile(userId, fileData) {
    try {
      const { original_filename, storage_path, title, description } = fileData;

      const newFile = await File.create({
        user_id: userId,
        original_filename,
        storage_path,
        title,
        description,
        status: 'uploaded', // default status
      });

      return newFile;
    } catch (error) {
      throw new Error('Error creating file: ' + error.message);
    }
  }

  // Fetch all files for a specific user
  static async getAllFilesByUser(userId, paginationOptions = { limit: 10, offset: 0 }) {
    try {
      const { limit, offset } = paginationOptions;

      const files = await File.findAll({
        where: { user_id: userId },
        limit: limit,
        offset: offset,
        order: [['uploaded_at', 'DESC']], // Sort by most recent uploads
      });

      return files;
    } catch (error) {
      throw new Error('Error fetching user files: ' + error.message);
    }
  }
}

module.exports = FileService;
