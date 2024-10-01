import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<ChatRoom />} />
    </Routes>
  </Router>
);

export default App;
