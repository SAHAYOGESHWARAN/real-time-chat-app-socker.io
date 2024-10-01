const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// WebSocket setup
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // Broadcast the message to all connected users
  });

  socket.on('videoOffer', (offer) => {
    socket.broadcast.emit('videoOffer', offer); // Send the video offer to other users
  });

  socket.on('videoAnswer', (answer) => {
    socket.broadcast.emit('videoAnswer', answer); // Send the video answer to other users
  });

  socket.on('iceCandidate', (candidate) => {
    socket.broadcast.emit('iceCandidate', candidate); // Send ICE candidates to other users
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
