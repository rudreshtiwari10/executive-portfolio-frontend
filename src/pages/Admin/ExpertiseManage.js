import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const ExpertiseManage = () => {
  const [expertises, setExpertises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    order: 0,
    isActive: true
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all expertises
  const fetchExpertises = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/expertise`, { headers });
      setExpertises(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch expertises:', error);
      alert('Failed to fetch expertises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertises();
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
          `${API_URL}/api/content/admin/expertise/${editingId}`,
          formData,
          { headers }
        );
        alert('Expertise updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/expertise`,
          formData,
          { headers }
        );
        alert('Expertise created successfully!');
      }

      // Reset form
      setFormData({ title: '', description: '', icon: '', order: 0, isActive: true });
      setEditingId(null);
      setShowForm(false);
      fetchExpertises();
    } catch (error) {
      console.error('Failed to save expertise:', error);
      alert('Failed to save expertise');
    }
  };

  // Handle edit
  const handleEdit = (expertise) => {
    setFormData({
      title: expertise.title,
      description: expertise.description,
      icon: expertise.icon || '',
      order: expertise.order || 0,
      isActive: expertise.isActive
    });
    setEditingId(expertise._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expertise?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/expertise/${id}`, { headers });
      alert('Expertise deleted successfully!');
      fetchExpertises();
    } catch (error) {
      console.error('Failed to delete expertise:', error);
      alert('Failed to delete expertise');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ title: '', description: '', icon: '', order: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Expertise</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Expertise'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Expertise' : 'Add New Expertise'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Cyber Security Strategy"
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
                placeholder="Describe this expertise area..."
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
                  placeholder="e.g., 🔐 or shield"
                />
              </div>

              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
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

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : expertises.length === 0 ? (
          <div className="empty-state">
            <p>No expertise items found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {expertises.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  {item.icon && <span className="item-icon">{item.icon}</span>}
                  <h3>{item.title}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>
                <p className="item-description">{item.description}</p>
                <div className="item-meta">
                  <small>Order: {item.order}</small>
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

export default ExpertiseManage;
