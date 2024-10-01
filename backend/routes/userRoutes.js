
const express = require('express');
const multer = require('multer');
const { uploadAvatar: uploadAvatarController } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Ensure User model is imported

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({ 
  dest: 'uploads/avatars/', // Set the destination for avatar uploads
  limits: { fileSize: 1024 * 1024 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG, and GIF are allowed!'), false);
    }
  }
});

// Route for uploading avatar
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatarController);

// Route for updating user profile
router.patch('/profile', authMiddleware, async (req, res) => {
  const { username, status } = req.body;
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (username) user.username = username;
  if (status) user.status = status;

  await user.save();
  res.status(200).json({ message: 'Profile updated successfully' });
});

module.exports = router;
