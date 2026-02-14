import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const CompanyManage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    services: [],
    website: '',
    logo: '',
    geographicReach: [],
    valueProposition: '',
    displayOrder: 0,
    isActive: true
  });
  const [serviceInput, setServiceInput] = useState('');
  const [reachInput, setReachInput] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/company`, { headers });
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      alert('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
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

  // Handle services array
  const addService = () => {
    if (serviceInput.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Handle geographic reach array
  const addReach = () => {
    if (reachInput.trim()) {
      setFormData(prev => ({
        ...prev,
        geographicReach: [...prev.geographicReach, reachInput.trim()]
      }));
      setReachInput('');
    }
  };

  const removeReach = (index) => {
    setFormData(prev => ({
      ...prev,
      geographicReach: prev.geographicReach.filter((_, i) => i !== index)
    }));
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing
        await axios.put(
          `${API_URL}/api/content/admin/company/${editingId}`,
          formData,
          { headers }
        );
        alert('Company updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/company`,
          formData,
          { headers }
        );
        alert('Company created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        services: [],
        website: '',
        logo: '',
        geographicReach: [],
        valueProposition: '',
        displayOrder: 0,
        isActive: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('Failed to save company: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit
  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      description: company.description || '',
      services: company.services || [],
      website: company.website || '',
      logo: company.logo || '',
      geographicReach: company.geographicReach || [],
      valueProposition: company.valueProposition || '',
      displayOrder: company.displayOrder || 0,
      isActive: company.isActive
    });
    setEditingId(company._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/company/${id}`, { headers });
      alert('Company deleted successfully!');
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
      alert('Failed to delete company');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      services: [],
      website: '',
      logo: '',
      geographicReach: [],
      valueProposition: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
    setServiceInput('');
    setReachInput('');
  };

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    return company.name.toLowerCase().includes(searchLower) ||
           (company.description && company.description.toLowerCase().includes(searchLower)) ||
           (company.valueProposition && company.valueProposition.toLowerCase().includes(searchLower));
  });

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Companies</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Company'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Company' : 'Add New Company'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the company..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Value Proposition</label>
              <textarea
                name="valueProposition"
                value={formData.valueProposition}
                onChange={handleChange}
                rows="3"
                placeholder="What unique value does this company provide?"
              />
            </div>

            <div className="form-group">
              <label>Services</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  placeholder="Add a service"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <button type="button" className="btn-success" onClick={addService}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.services.map((service, index) => (
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
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
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

            <div className="form-group">
              <label>Geographic Reach</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={reachInput}
                  onChange={(e) => setReachInput(e.target.value)}
                  placeholder="Add a location/region"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReach())}
                />
                <button type="button" className="btn-success" onClick={addReach}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.geographicReach.map((reach, index) => (
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
                    <span>{reach}</span>
                    <button
                      type="button"
                      onClick={() => removeReach(index)}
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
          <label>Search Companies</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or value proposition..."
          />
        </div>
      </div>

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <p>No companies found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredCompanies.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  {item.logo && (
                    <img
                      src={item.logo}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <h3>{item.name}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>

                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}

                {item.valueProposition && (
                  <div style={{ marginBottom: '12px' }}>
                    <small style={{ fontWeight: '600', color: '#2c3e50', display: 'block', marginBottom: '4px' }}>
                      Value Proposition:
                    </small>
                    <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
                      {item.valueProposition}
                    </p>
                  </div>
                )}

                {item.website && (
                  <div style={{ marginBottom: '8px' }}>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: '#667eea', textDecoration: 'none' }}
                    >
                      {item.website}
                    </a>
                  </div>
                )}

                {item.services && item.services.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <small style={{ fontWeight: '600', color: '#2c3e50' }}>Services:</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {item.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#667eea',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '11px'
                          }}
                        >
                          {service}
                        </span>
                      ))}
                      {item.services.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#7f8c8d' }}>
                          +{item.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.geographicReach && item.geographicReach.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <small style={{ fontWeight: '600', color: '#2c3e50' }}>Geographic Reach:</small>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                      {item.geographicReach.join(', ')}
                    </div>
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

export default CompanyManage;
