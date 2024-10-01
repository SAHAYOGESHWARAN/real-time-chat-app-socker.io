import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatRoom.css'; // assuming you will style the ChatRoom

const socket = io.connect('http://localhost:5000');

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000); // reset typing indicator after 3 seconds
    });
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('joinRoom', { username, room });
    }
  };

  const sendMessage = () => {
    if (message && username && room) {
      socket.emit('chatMessage', { username, message, room });
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { username, room });
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h2>Realtime Chat</h2>
      </div>
      
      <div className="chat-room-input">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}</strong>: {msg.message}
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">{typingUser} is typing...</div>}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
