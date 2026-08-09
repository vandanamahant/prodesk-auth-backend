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

  const handleStripeCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/create-checkout-session', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url; 
    } catch (err) {
      console.error("Stripe error:", err);
      alert("Payment initiation failed!");
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

        <form onSubmit={handleCreate} className="item-form">
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

        <div className="item-list">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))}
        </div>

        <button className="stripe-btn" onClick={handleStripeCheckout}>
          Pay with Stripe (Test Mode)
        </button>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}