// backend/routes/messageRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the path and name are correct
const multer = require('multer');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Use original file name
  }
});

const upload = multer({ storage: storage });

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
      fileType: req.file.mimetype,
    };

    // Emit the message through sockets
    req.app.get('io').emit('receiveMessage', message);

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Export the router
module.exports = router;
