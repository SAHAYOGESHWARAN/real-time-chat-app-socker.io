const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Fetch chat history
router.get('/history', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
  res.json(messages);
});

module.exports = router;
