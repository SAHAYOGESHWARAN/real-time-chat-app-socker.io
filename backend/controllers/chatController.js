

const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
