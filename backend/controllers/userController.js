const User = require('../models/User');
const path = require('path');

exports.uploadAvatar = async (req, res) => {
  const user = await User.findById(req.user.id);
  
  user.avatar = req.file.path; // Save the file path
  await user.save();
  
  res.status(200).json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
};
