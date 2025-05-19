// src/auth/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../files/user.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists and validate password (for demo, we're using plaintext password)
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};
