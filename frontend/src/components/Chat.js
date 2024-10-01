import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message" 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
