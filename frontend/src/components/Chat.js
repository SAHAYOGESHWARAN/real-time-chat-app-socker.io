import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const socket = io('http://localhost:5000');
  const peerConnection = new RTCPeerConnection();

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for video offers and ICE candidates
    socket.on('videoOffer', async (offer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('videoAnswer', answer);
    });

    socket.on('iceCandidate', (candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, peerConnection]);

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setMessage('');
  };

  const sendFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await axios.post('/api/message/send-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    socket.emit('sendMessage', response.data); // Assuming the response contains the necessary message data
    setFile(null);
  };

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    
    // Add event listeners for ICE candidates and remote stream
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', event.candidate);
      }
    };
    
    peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo');
      remoteVideo.srcObject = event.streams[0];
    };
    
    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('videoOffer', offer);
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

      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={sendFile}>Send File</button>

      <button onClick={startCall}>Start Call</button>
      <video id="remoteVideo" autoPlay playsInline></video>
    </div>
  );
};

export default Chat;
