const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const chatController = require('../controllers/chatController');

// Fetch chat history
router.get('/history', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
  res.json(messages);
});



// @route   GET api/chat/history/:room
// @desc    Get chat history for a room
router.get('/history/:room', chatController.getMessages);

module.exports = router;
