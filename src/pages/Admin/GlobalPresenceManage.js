import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const GlobalPresenceManage = () => {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    country: '',
    region: '',
    flagEmoji: '',
    description: '',
    partnerships: [],
    displayOrder: 0,
    isActive: true
  });
  const [partnershipInput, setPartnershipInput] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all global presence items
  const fetchPresences = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/global-presence`, { headers });
      setPresences(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch global presence:', error);
      alert('Failed to fetch global presence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresences();
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

  // Handle partnerships array
  const addPartnership = () => {
    if (partnershipInput.trim()) {
      setFormData(prev => ({
        ...prev,
        partnerships: [...prev.partnerships, partnershipInput.trim()]
      }));
      setPartnershipInput('');
    }
  };

  const removePartnership = (index) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.filter((_, i) => i !== index)
    }));
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing
        await axios.put(
          `${API_URL}/api/content/admin/global-presence/${editingId}`,
          formData,
          { headers }
        );
        alert('Global presence updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/global-presence`,
          formData,
          { headers }
        );
        alert('Global presence created successfully!');
      }

      // Reset form
      setFormData({
        country: '',
        region: '',
        flagEmoji: '',
        description: '',
        partnerships: [],
        displayOrder: 0,
        isActive: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchPresences();
    } catch (error) {
      console.error('Failed to save global presence:', error);
      alert('Failed to save global presence: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit
  const handleEdit = (presence) => {
    setFormData({
      country: presence.country,
      region: presence.region || '',
      flagEmoji: presence.flagEmoji || '',
      description: presence.description || '',
      partnerships: presence.partnerships || [],
      displayOrder: presence.displayOrder || 0,
      isActive: presence.isActive
    });
    setEditingId(presence._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this global presence entry?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/global-presence/${id}`, { headers });
      alert('Global presence deleted successfully!');
      fetchPresences();
    } catch (error) {
      console.error('Failed to delete global presence:', error);
      alert('Failed to delete global presence');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      country: '',
      region: '',
      flagEmoji: '',
      description: '',
      partnerships: [],
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
    setPartnershipInput('');
  };

  // Filter presences
  const filteredPresences = presences.filter(presence => {
    const searchLower = searchTerm.toLowerCase();
    return presence.country.toLowerCase().includes(searchLower) ||
           (presence.region && presence.region.toLowerCase().includes(searchLower)) ||
           (presence.description && presence.description.toLowerCase().includes(searchLower));
  });

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Global Presence</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Location'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Global Presence' : 'Add New Global Presence'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="e.g., United States"
                />
              </div>

              <div className="form-group">
                <label>Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="e.g., North America"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Flag Emoji *</label>
              <input
                type="text"
                name="flagEmoji"
                value={formData.flagEmoji}
                onChange={handleChange}
                required
                placeholder="e.g., 🇺🇸"
                maxLength="4"
              />
              <small style={{ color: '#7f8c8d', fontSize: '13px' }}>
                Enter the country's flag emoji (e.g., 🇺🇸 for USA, 🇬🇧 for UK)
              </small>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your presence in this location..."
              />
            </div>

            <div className="form-group">
              <label>Partnerships</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={partnershipInput}
                  onChange={(e) => setPartnershipInput(e.target.value)}
                  placeholder="Add a partnership"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartnership())}
                />
                <button type="button" className="btn-success" onClick={addPartnership}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.partnerships.map((partnership, index) => (
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
                    <span>{partnership}</span>
                    <button
                      type="button"
                      onClick={() => removePartnership(index)}
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

      {/* Search */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Search Locations</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by country, region, or description..."
          />
        </div>
      </div>

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredPresences.length === 0 ? (
          <div className="empty-state">
            <p>No global presence locations found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredPresences.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  {item.flagEmoji && <span className="item-icon">{item.flagEmoji}</span>}
                  <h3>{item.country}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>
                {item.region && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.region}
                    </span>
                  </div>
                )}
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                {item.partnerships && item.partnerships.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <small style={{ fontWeight: '600', color: '#2c3e50' }}>Partnerships:</small>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {item.partnerships.slice(0, 3).map((partnership, idx) => (
                        <li key={idx}>{partnership}</li>
                      ))}
                      {item.partnerships.length > 3 && <li>+{item.partnerships.length - 3} more...</li>}
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

export default GlobalPresenceManage;
