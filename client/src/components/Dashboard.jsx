import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const userRes = await API.get('/auth/me');
        setUser(userRes.data);

        const itemsRes = await API.get('/items');
        setItems(itemsRes.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await API.post('/items', { title, description });
      setItems([...items, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const previousItems = [...items];
    setItems(items.filter(item => item._id !== id));

    try {
      await API.delete(`/items/${id}`);
    } catch (err) {
      console.error(err);
      setItems(previousItems);
    }
  };

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

        <form onSubmit={handleCreate} className="item-form" style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Item</button>
        </form>

        <div className="item-list" style={{ marginTop: '20px', textAlign: 'left' }}>
          {items.map((item) => (
            <div key={item._id} className="item-card" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button onClick={() => handleDelete(item._id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
      </div>
    </div>
  );
}