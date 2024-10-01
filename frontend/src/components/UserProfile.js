import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [status, setStatus] = useState('');

  const updateStatus = async () => {
    const token = localStorage.getItem('token');
    await axios.patch('/api/user/status', { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div>
      <input 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        placeholder="Update your status" 
      />
      <button onClick={updateStatus}>Update Status</button>
    </div>
  );
};

export default UserProfile;
