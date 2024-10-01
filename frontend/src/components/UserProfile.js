const UserProfile = () => {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
  
    const updateProfile = async () => {
      const token = localStorage.getItem('token');
      await axios.patch('/api/user/profile', { username, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
  
    return (
      <div>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Update your username" 
        />
        <input 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          placeholder="Update your status" 
        />
        <button onClick={updateProfile}>Update Profile</button>
      </div>
    );
  };
  