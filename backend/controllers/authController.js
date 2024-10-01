

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const secret = 'your_jwt_secret_key'; // Replace with your secret key or use environment variables

exports.register = async (req, res) => {
  // Validate user input
  // ... code for validation

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract user data
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user
    user = new User({ username, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Return JWT token
    const payload = { userId: user.id };
    jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  // Validate user input
  // ... code for validation

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract user data
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Return JWT token
    const payload = { userId: user.id };
    jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
