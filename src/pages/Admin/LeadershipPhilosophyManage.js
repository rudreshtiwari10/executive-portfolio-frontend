import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const LeadershipPhilosophyManage = () => {
  const [philosophies, setPhilosophies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    displayOrder: 0,
    isActive: true
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all leadership philosophies
  const fetchPhilosophies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/leadership-philosophy`, { headers });
      setPhilosophies(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch leadership philosophies:', error);
      alert('Failed to fetch leadership philosophies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhilosophies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing
        await axios.put(
          `${API_URL}/api/content/admin/leadership-philosophy/${editingId}`,
          formData,
          { headers }
        );
        alert('Leadership philosophy updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/leadership-philosophy`,
          formData,
          { headers }
        );
        alert('Leadership philosophy created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        icon: '',
        displayOrder: 0,
        isActive: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchPhilosophies();
    } catch (error) {
      console.error('Failed to save leadership philosophy:', error);
      alert('Failed to save leadership philosophy: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit
  const handleEdit = (philosophy) => {
    setFormData({
      title: philosophy.title,
      description: philosophy.description,
      icon: philosophy.icon || '',
      displayOrder: philosophy.displayOrder || 0,
      isActive: philosophy.isActive
    });
    setEditingId(philosophy._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leadership philosophy?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/leadership-philosophy/${id}`, { headers });
      alert('Leadership philosophy deleted successfully!');
      fetchPhilosophies();
    } catch (error) {
      console.error('Failed to delete leadership philosophy:', error);
      alert('Failed to delete leadership philosophy');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Filter philosophies
  const filteredPhilosophies = philosophies.filter(philosophy => {
    const searchLower = searchTerm.toLowerCase();
    return philosophy.title.toLowerCase().includes(searchLower) ||
           philosophy.description.toLowerCase().includes(searchLower);
  });

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Leadership Philosophy</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Philosophy'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Leadership Philosophy' : 'Add New Leadership Philosophy'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Visionary Thinking"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe this leadership philosophy..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Icon (emoji or name)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., 🎯 or target"
                />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active (visible on website)</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-success">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Search Leadership Philosophies</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
          />
        </div>
      </div>

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredPhilosophies.length === 0 ? (
          <div className="empty-state">
            <p>No leadership philosophies found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredPhilosophies.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  {item.icon && <span className="item-icon">{item.icon}</span>}
                  <h3>{item.title}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>
                <p className="item-description">{item.description}</p>
                <div className="item-meta">
                  <small>Order: {item.displayOrder}</small>
                </div>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadershipPhilosophyManage;
