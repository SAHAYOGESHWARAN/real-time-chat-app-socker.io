const express = require('express');
const multer = require('multer');
const { uploadAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

module.exports = router;
