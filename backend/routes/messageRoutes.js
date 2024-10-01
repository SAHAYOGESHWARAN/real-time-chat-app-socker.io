const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Import the upload middleware
const router = express.Router();
let io; // Declare io here

// Function to set the io instance (to be called from server.js)
const setSocketIO = (socketIO) => {
  io = socketIO; // Set the io instance
};

// File upload endpoint
router.post('/send-file', authMiddleware, upload, async (req, res) => {
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

    // Emit the message through sockets
    io.emit('receiveMessage', message);

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Export the router and the setSocketIO function
module.exports = { router, setSocketIO };
