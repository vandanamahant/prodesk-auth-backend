import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const res = await API.get('/auth/me'); 
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    };

    fetchUserData();
  }, []); // <-- Yahan dependency array khali [] honi chahiye taki yeh sirf ek baar load ho!

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-form dashboard-card">
        <h2>Dashboard</h2>
        {user ? (
          <div className="user-info">
            <p className="welcome-text">Welcome, <span>{user.name}</span>!</p>
            <p className="email-text">Email: {user.email}</p>
          </div>
        ) : (
          <p className="loading-text">Loading...</p>
        )}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}