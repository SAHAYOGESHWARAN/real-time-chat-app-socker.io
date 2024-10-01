const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendMessage } = require('../controllers/messageController'); // Assume you have a message controller
const router = express.Router();

// File upload endpoint
router.post('/send-file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Construct message object
    const message = {
      sender: req.user.id,
      filePath: req.file.path,
      fileType: req.file.mimetype, // Store the file type for further processing
    };

    // Here, you should save the message to the database (not shown in this snippet)
    // await Message.create(message); // Save to your database (assuming Message is your model)

    // Emit the message through sockets
    io.emit('receiveMessage', message); // Ensure you have `io` available in this scope

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
