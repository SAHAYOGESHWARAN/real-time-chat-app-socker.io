import React, { useState } from 'react';
import axios from 'axios';

const AvatarUpload = () => {
  const [avatar, setAvatar] = useState(null);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    const token = localStorage.getItem('token');
    
    await axios.post('/api/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setAvatar(e.target.files[0])} 
      />
      <button onClick={handleUpload}>Upload Avatar</button>
    </div>
  );
};

export default AvatarUpload;
