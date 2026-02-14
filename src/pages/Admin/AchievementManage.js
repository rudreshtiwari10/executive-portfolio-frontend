import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const AchievementManage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    year: '',
    displayOrder: 0,
    isActive: true
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all achievements
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/achievement`, { headers });
      setAchievements(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      alert('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
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
          `${API_URL}/api/content/admin/achievement/${editingId}`,
          formData,
          { headers }
        );
        alert('Achievement updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/achievement`,
          formData,
          { headers }
        );
        alert('Achievement created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        year: '',
        displayOrder: 0,
        isActive: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchAchievements();
    } catch (error) {
      console.error('Failed to save achievement:', error);
      alert('Failed to save achievement: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit
  const handleEdit = (achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description || '',
      category: achievement.category || '',
      year: achievement.year || '',
      displayOrder: achievement.displayOrder || 0,
      isActive: achievement.isActive
    });
    setEditingId(achievement._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/admin/achievement/${id}`, { headers });
      alert('Achievement deleted successfully!');
      fetchAchievements();
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      alert('Failed to delete achievement');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      year: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = achievement.title.toLowerCase().includes(searchLower) ||
                         (achievement.description && achievement.description.toLowerCase().includes(searchLower));
    const matchesCategory = !filterCategory || achievement.category === filterCategory;
    const matchesYear = !filterYear || achievement.year === filterYear;
    return matchesSearch && matchesCategory && matchesYear;
  });

  // Get unique categories and years
  const categories = [...new Set(achievements.map(a => a.category).filter(Boolean))];
  const years = [...new Set(achievements.map(a => a.year).filter(Boolean))].sort((a, b) => b - a);

  // Category badge colors
  const getCategoryColor = (category) => {
    const colors = {
      'Award': '#f39c12',
      'Certification': '#3498db',
      'Publication': '#9b59b6',
      'Project': '#27ae60',
      'Recognition': '#e74c3c',
      'Education': '#16a085'
    };
    return colors[category] || '#667eea';
  };

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage Achievements</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Achievement'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Best Security Implementation Award"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe this achievement..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="Award">Award</option>
                  <option value="Certification">Certification</option>
                  <option value="Publication">Publication</option>
                  <option value="Project">Project</option>
                  <option value="Recognition">Recognition</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
                <small style={{ color: '#7f8c8d', fontSize: '13px' }}>
                  You can also type a custom category
                </small>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  pattern="[0-9]{4}"
                  maxLength="4"
                />
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
            <label>Search Achievements</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Filter by Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Filter by Year</label>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredAchievements.length === 0 ? (
          <div className="empty-state">
            <p>No achievements found. Add your first one!</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredAchievements.map((item) => (
              <div key={item._id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-header">
                  <h3>{item.title}</h3>
                  {!item.isActive && <span className="badge-inactive">Inactive</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {item.category && (
                    <span style={{
                      background: getCategoryColor(item.category),
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.category}
                    </span>
                  )}
                  {item.year && (
                    <span style={{
                      background: '#95a5a6',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.year}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="item-description">{item.description}</p>
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

export default AchievementManage;
