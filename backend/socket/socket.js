const { Server } = require('socket.io');

const setupSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('sendMessage', (data) => {
      io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = setupSocket;
