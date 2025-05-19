// src/auth/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing
const { User } = require('../files/user.model'); // Assuming user model is in the 'files' folder

class AuthService {
  // Validate user credentials and issue JWT token
  static async login(email, password) {
    try {
      // Check if the user exists
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare hashed password with the input password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET, // JWT secret stored in .env
        { expiresIn: '1h' } // Set token expiration time
      );

      return { token };
    } catch (err) {
      throw new Error('Authentication failed: ' + err.message);
    }
  }

  // Register a new user (if needed)
  static async register(email, password) {
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

      // Create a new user
      const user = await User.create({
        email,
        password: hashedPassword,
      });

      // Generate JWT token for the new user
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET, // JWT secret stored in .env
        { expiresIn: '1h' } // Set token expiration time
      );

      return { token };
    } catch (err) {
      throw new Error('Registration failed: ' + err.message);
    }
  }

  // Verify JWT token (for protected routes)
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = AuthService;
