// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Ensure this is the correct path
const userRoutes = require('./routes/userRoutes'); // Ensure userRoutes is defined correctly
const messageRoutes = require('./routes/messageRoutes'); // Ensure messageRoutes is defined correctly
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

// Set the io instance on the app for use in routes
app.set('io', io);

// Use routes
app.use('/api/user', userRoutes); // Ensure userRoutes is defined correctly
app.use('/api/message', messageRoutes); // Ensure messageRoutes is defined correctly

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('New user connected');

  // Handle incoming messages
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // Broadcast the message to all connected users
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
