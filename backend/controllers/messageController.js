const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');


// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // add original file extension
  }
});

// Define file filter to restrict file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi|mov/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, GIF, MP4, MKV, AVI, and MOV are allowed!'), false);
  }
};

exports.saveMessage = async (messageData) => {
    const message = new Message(messageData);
    await message.save();
  };
  
// Set up multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });
