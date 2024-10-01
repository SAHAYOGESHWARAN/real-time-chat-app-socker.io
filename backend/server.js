const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Ensure this is your database connection function
const userRoutes = require('./routes/userRoutes');
const { router: messageRoutes, setSocketIO } = require('./routes/messageRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to the database
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

// Set the io instance for message routes
setSocketIO(io);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('New user connected');

  // Handle incoming messages
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // Broadcast the message to all connected users
  });

  // Handle video offers
  socket.on('videoOffer', (offer) => {
    socket.broadcast.emit('videoOffer', offer); // Send the video offer to other users
  });

  // Handle video answers
  socket.on('videoAnswer', (answer) => {
    socket.broadcast.emit('videoAnswer', answer); // Send the video answer to other users
  });

  // Handle ICE candidates
  socket.on('iceCandidate', (candidate) => {
    socket.broadcast.emit('iceCandidate', candidate); // Send ICE candidates to other users
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
