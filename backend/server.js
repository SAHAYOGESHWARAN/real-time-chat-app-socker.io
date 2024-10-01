
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/realtime-chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware to authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.userId;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', async ({ username, room }) => {
    socket.join(room);
    socket.room = room;

    // Load message history
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    socket.emit('loadMessages', messages);

    // Notify others
    socket.broadcast.to(room).emit('notification', `${username} has joined the room.`);
  });

  socket.on('chatMessage', async ({ username, message }) => {
    const room = socket.room;
    const msg = new Message({ username, message, room });
    await msg.save();
    io.to(room).emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
