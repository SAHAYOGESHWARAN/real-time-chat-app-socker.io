const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadAvatar = require('../middleware/uploadAvatar'); // Import the multer config
const { uploadAvatar: uploadAvatarController } = require('../controllers/userController');

const router = express.Router();

// Route for uploading avatar
router.post('/upload-avatar', authMiddleware, uploadAvatar, uploadAvatarController);

module.exports = router;
