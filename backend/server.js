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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

mongoose.connect('mongodb://localhost:27017/realtime-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Store connected users
let connectedUsers = {};

// Load chat history on connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Add user to connected users
  socket.on('joinRoom', ({ username, room }) => {
    connectedUsers[socket.id] = username;
    socket.join(room);
    
    // Broadcast to others that user joined
    socket.broadcast.to(room).emit('message', {
      username: 'Admin',
      message: `${username} has joined the chat`,
      timestamp: new Date()
    });
    
    // Send chat history
    Message.find().sort({ timestamp: -1 }).limit(50).exec((err, messages) => {
      if (!err) {
        socket.emit('loadMessages', messages.reverse());
      }
    });
  });

  // Handle chat message
  socket.on('chatMessage', async (data) => {
    const message = new Message({ username: data.username, message: data.message, room: data.room });
    await message.save();

    io.to(data.room).emit('message', {
      username: data.username,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Typing event
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('typing', data.username);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id];
    console.log(`${username} disconnected`);
    delete connectedUsers[socket.id];
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
