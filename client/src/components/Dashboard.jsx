import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
      const res = await API.post('/ai/items', { title, description });
      
      setItems([...items, res.data.item]);
      setTitle('');
      setDescription('');
      
      console.log("AI Insights:", res.data.aiInsights);
    } catch (err) {
      console.error("Error creating AI item:", err);
      alert("Failed to create item with AI!");
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

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`/items/${id}`, {
        title: editTitle,
        description: editDescription
      });
      setItems(items.map(item => (item._id === id ? res.data : item)));
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update item!");
    }
  };

  const handleStripeCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/create-checkout-session', {}, {
        headers: { Authorization: `Bearer ` }
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

  const chartData = {
    labels: items.map(item => item.title.length > 10 ? item.title.substring(0, 10) + '...' : item.title),
    datasets: [
      {
        label: 'Item Title Length / Metrics',
        data: items.map(item => item.title.length),
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
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

        {items.length > 0 && (
          <div className="chart-container">
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
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
              {editingId === item._id ? (
                <div className="edit-form-inline">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className="btn-group">
                    <button className="save-btn" onClick={() => handleUpdate(item._id)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="btn-group">
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              )}
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