// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.message || err);
    res.status(500).json({ message: err.message || 'Server Error' });
  };
  
  module.exports = errorHandler;
  