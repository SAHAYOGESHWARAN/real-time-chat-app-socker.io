const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/realtime-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Real-time connection with Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle incoming chat messages
  socket.on('chatMessage', async (data) => {
    const message = new Message({ username: data.username, message: data.message });
    await message.save();
    io.emit('chatMessage', message); // Send message to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
