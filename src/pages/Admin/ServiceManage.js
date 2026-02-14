import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const ServiceManage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: [],
    category: '',
    displayOrder: 0,
    isActive: true
  });
  const [featureInput, setFeatureInput] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/service`, { headers });
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      alert('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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

  // Handle features array
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing
        await axios.put(
          `${API_URL}/api/content/admin/service/${editingId}`,
          formData,
          { headers }
        );
        alert('Service updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/service`,
          formData,
          { headers }
        );
        alert('Service created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        icon: '',
        features: [],
        category: '',
        displayOrder: 0,
        isActive: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit
  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
      features: service.features || [],
      category: service.category || '',
      displayOrder: service.displayOrder || 0,
      isActive: service.isActive
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/service/${id}`, { headers });
      alert('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      features: [],
      category: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
    setFeatureInput('');
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Services</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Service'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Cybersecurity Consulting"
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
                placeholder="Describe this service..."
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
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Security, Consulting"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Features</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button type="button" className="btn-success" onClick={addFeature}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#e9ecef',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
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

      {/* Search and Filter */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Search Services</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
            />
          </div>
          <div className="form-group">
            <label>Filter by Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No services found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredServices.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  {item.icon && <span className="item-icon">{item.icon}</span>}
                  <h3>{item.title}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>
                <p className="item-description">{item.description}</p>
                {item.category && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.category}
                    </span>
                  </div>
                )}
                {item.features && item.features.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <small style={{ fontWeight: '600', color: '#2c3e50' }}>Features:</small>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {item.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                      {item.features.length > 3 && <li>+{item.features.length - 3} more...</li>}
                    </ul>
                  </div>
                )}
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

export default ServiceManage;
