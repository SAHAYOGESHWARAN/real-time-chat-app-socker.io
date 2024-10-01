const multer = require('multer');
const path = require('path');

// Set storage engine for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/'); // Specify directory for avatar uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use original file extension
  }
});

// Define file filter for avatar files
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, and GIF are allowed!'), false);
  }
};

// Set up multer for avatar uploads
const uploadAvatar = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 } // Limit file size to 1MB
}).single('avatar'); // Specify field name for the avatar file

module.exports = uploadAvatar;
