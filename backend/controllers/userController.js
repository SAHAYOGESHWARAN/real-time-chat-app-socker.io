// controllers/userController.js
const User = require('../models/User');

exports.uploadAvatar = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's avatar path
    user.avatar = req.file.path; // Save the file path
    await user.save(); // Save changes to the database

    // Return success response
    res.status(200).json({ 
      message: 'Avatar uploaded successfully', 
      avatar: user.avatar 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
