import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentManage.css';

const AboutManage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    biography: '',
    education: [],
    highlights: [],
    profileImage: '',
    isActive: true
  });
  const [highlightInput, setHighlightInput] = useState('');
  const [educationForm, setEducationForm] = useState({
    degree: '',
    field: '',
    institution: '',
    year: ''
  });
  const [showEducationForm, setShowEducationForm] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch about data
  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/admin/about`, { headers });
      const items = response.data.data;
      const data = Array.isArray(items) ? items[0] : items;
      if (data) {
        setAbout(data);
        setFormData({
          biography: data.biography || '',
          education: data.education || [],
          highlights: data.highlights || [],
          profileImage: data.profileImage || '',
          isActive: data.isActive !== undefined ? data.isActive : true
        });
      }
    } catch (error) {
      console.error('Failed to fetch about:', error);
      // Don't alert if no data exists yet
      if (error.response?.status !== 404) {
        alert('Failed to fetch about data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
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

  // Handle highlights array
  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Handle education array
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEducation = () => {
    if (educationForm.degree && educationForm.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationForm }]
      }));
      setEducationForm({ degree: '', field: '', institution: '', year: '' });
      setShowEducationForm(false);
    } else {
      alert('Please fill in at least degree and institution');
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Handle save (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (about) {
        // Update existing
        await axios.put(
          `${API_URL}/api/content/admin/about/${about._id}`,
          formData,
          { headers }
        );
        alert('About section updated successfully!');
      } else {
        // Create new
        await axios.post(
          `${API_URL}/api/content/admin/about`,
          formData,
          { headers }
        );
        alert('About section created successfully!');
      }

      fetchAbout();
    } catch (error) {
      console.error('Failed to save about:', error);
      alert('Failed to save about: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="content-manage">
      <div className="content-manage-header">
        <h1>Manage About Section</h1>
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {about ? 'Update your about information' : 'Create your about section'}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="form-card">
          <h2>{about ? 'Edit About Section' : 'Create About Section'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Biography *</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                required
                rows="8"
                placeholder="Write your professional biography..."
              />
              <small style={{ color: '#7f8c8d', fontSize: '13px' }}>
                This is your main about text. Write about your background, experience, and expertise.
              </small>
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />
              <small style={{ color: '#7f8c8d', fontSize: '13px' }}>
                Enter the URL of your profile image
              </small>
            </div>

            {/* Education Section */}
            <div className="form-group">
              <label>Education</label>
              <div style={{ marginBottom: '12px' }}>
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </div>
                        <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px' }}>
                          {edu.institution} {edu.year && `• ${edu.year}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!showEducationForm ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEducationForm(true)}
                >
                  + Add Education
                </button>
              ) : (
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Degree *</label>
                      <input
                        type="text"
                        name="degree"
                        value={educationForm.degree}
                        onChange={handleEducationChange}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        name="field"
                        value={educationForm.field}
                        onChange={handleEducationChange}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Institution *</label>
                      <input
                        type="text"
                        name="institution"
                        value={educationForm.institution}
                        onChange={handleEducationChange}
                        placeholder="e.g., Harvard University"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="text"
                        name="year"
                        value={educationForm.year}
                        onChange={handleEducationChange}
                        placeholder="e.g., 2015"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="button" className="btn-success" onClick={addEducation}>
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowEducationForm(false);
                        setEducationForm({ degree: '', field: '', institution: '', year: '' });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Highlights Section */}
            <div className="form-group">
              <label>Highlights</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add a career highlight"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                />
                <button type="button" className="btn-success" onClick={addHighlight}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#e9ecef',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      maxWidth: '100%'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
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
              <small style={{ color: '#7f8c8d', fontSize: '13px', display: 'block', marginTop: '8px' }}>
                Add key achievements, awards, or notable accomplishments
              </small>
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
                {about ? 'Update About Section' : 'Create About Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview */}
      {about && (
        <div className="content-list" style={{ marginTop: '20px' }}>
          <h2 style={{ marginBottom: '16px' }}>Preview</h2>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
            {formData.profileImage && (
              <div style={{ marginBottom: '16px' }}>
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '8px' }}>Biography</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                {formData.biography}
              </p>
            </div>
            {formData.education.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ marginBottom: '8px' }}>Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <strong>{edu.degree} {edu.field && `in ${edu.field}`}</strong>
                    <br />
                    <span style={{ color: '#7f8c8d' }}>
                      {edu.institution} {edu.year && `• ${edu.year}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {formData.highlights.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '8px' }}>Highlights</h3>
                <ul>
                  {formData.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutManage;
