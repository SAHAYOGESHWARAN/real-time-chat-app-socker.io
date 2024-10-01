const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/send-file', authMiddleware, upload.single('file'), async (req, res) => {
  const message = {
    sender: req.user.id,
    filePath: req.file.path,
  };

  // You can store this message in the database and then emit it through sockets
  io.emit('receiveMessage', message);
  res.status(200).json(message);
});
