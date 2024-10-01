// frontend/src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Registration successful');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };
  
  return (
    <div className="register-container">
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;
