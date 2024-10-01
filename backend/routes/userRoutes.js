const express = require('express');
const multer = require('multer');
const { uploadAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

router.patch('/profile', authMiddleware, async (req, res) => {
    const { username, status } = req.body;
    const user = await User.findById(req.user.id);
  
    if (username) user.username = username;
    if (status) user.status = status;
    
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  });
  
module.exports = router;
