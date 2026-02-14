import React, { useState, useEffect } from 'react';
import './MessageFormModal.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

const MessageFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    purpose: '',
    purposeDetail: '',
    organization: '',
    phone: '',
    message: '',
    consentGiven: false
  });

  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'rate-limit'
  const [statusMessage, setStatusMessage] = useState('');

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, attachment: 'Only PDF, DOC, and DOCX files are allowed' }));
        e.target.value = '';
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, attachment: 'File size must be less than 5MB' }));
        e.target.value = '';
        return;
      }

      setAttachment(file);
      setErrors(prev => ({ ...prev, attachment: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose';
    }

    if (formData.purpose === 'Other' && !formData.purposeDetail.trim()) {
      newErrors.purposeDetail = 'Please specify the purpose';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.consentGiven) {
      newErrors.consentGiven = 'You must consent to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare form data for multipart/form-data
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('purpose', formData.purpose);
      submitData.append('purposeDetail', formData.purposeDetail.trim());
      submitData.append('organization', formData.organization.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('message', formData.message.trim());
      submitData.append('consentGiven', formData.consentGiven);

      if (attachment) {
        submitData.append('attachment', attachment);
      }

      const response = await fetch(`${API_URL}/api/messages/submit`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Your message has been sent successfully! We will get back to you soon.');

        // Reset form after 3 seconds
        setTimeout(() => {
          resetForm();
          setTimeout(() => {
            handleClose();
          }, 500);
        }, 3000);

      } else if (response.status === 429) {
        // Rate limit exceeded
        setSubmitStatus('rate-limit');
        setStatusMessage('You have reached the message limit. Please try again after an hour.');
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message || 'Failed to send message. Please try again.');
      }

    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setStatusMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      purpose: '',
      purposeDetail: '',
      organization: '',
      phone: '',
      message: '',
      consentGiven: false
    });
    setAttachment(null);
    setErrors({});
    setSubmitStatus(null);
    setStatusMessage('');

    // Clear file input
    const fileInput = document.getElementById('modal-attachment');
    if (fileInput) fileInput.value = '';
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'modal-open' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="status-message success-status">
            <div className="status-icon">✓</div>
            <div className="status-content">
              <h3>Message Sent Successfully!</h3>
              <p>{statusMessage}</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="status-message error-status">
            <div className="status-icon">⚠</div>
            <div className="status-content">
              <h3>Error Sending Message</h3>
              <p>{statusMessage}</p>
            </div>
          </div>
        )}

        {submitStatus === 'rate-limit' && (
          <div className="status-message rate-limit-status">
            <div className="status-icon">⏱</div>
            <div className="status-content">
              <h3>Message Limit Reached</h3>
              <p>{statusMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitStatus && (
          <>
            <div className="modal-header">
              <h2>Send us a Message</h2>
              <p>Have a question or proposal? We'd love to hear from you.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="modal-fullName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="modal-email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                {/* Organization */}
                <div className="form-group">
                  <label htmlFor="modal-organization">Organization / Company</label>
                  <input
                    type="text"
                    id="modal-organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company name (optional)"
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="modal-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="modal-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900 (optional)"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label htmlFor="modal-purpose">
                  Purpose of Contact <span className="required">*</span>
                </label>
                <select
                  id="modal-purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={errors.purpose ? 'error' : ''}
                >
                  <option value="">Select a purpose</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership Proposal">Partnership Proposal</option>
                  <option value="Consulting / Advisory Request">Consulting / Advisory Request</option>
                  <option value="Speaking / Media Request">Speaking / Media Request</option>
                  <option value="Other">Other</option>
                </select>
                {errors.purpose && <span className="error-text">{errors.purpose}</span>}
              </div>

              {/* Purpose Detail (shown only if Other is selected) */}
              {formData.purpose === 'Other' && (
                <div className="form-group">
                  <label htmlFor="modal-purposeDetail">
                    Please Specify <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-purposeDetail"
                    name="purposeDetail"
                    value={formData.purposeDetail}
                    onChange={handleChange}
                    placeholder="Briefly describe your purpose"
                    className={errors.purposeDetail ? 'error' : ''}
                  />
                  {errors.purposeDetail && <span className="error-text">{errors.purposeDetail}</span>}
                </div>
              )}

              {/* Message */}
              <div className="form-group">
                <label htmlFor="modal-message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your message here..."
                  className={errors.message ? 'error' : ''}
                />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              {/* File Attachment */}
              <div className="form-group">
                <label htmlFor="modal-attachment">
                  Attachment (Optional)
                </label>
                <input
                  type="file"
                  id="modal-attachment"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <small className="help-text">PDF, DOC, or DOCX (max 5MB)</small>
                {errors.attachment && <span className="error-text">{errors.attachment}</span>}
                {attachment && (
                  <div className="file-info">
                    📎 {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={formData.consentGiven}
                    onChange={handleChange}
                    className={errors.consentGiven ? 'error' : ''}
                  />
                  <span>
                    I consent to the storage and processing of my data for responding to my inquiry. <span className="required">*</span>
                  </span>
                </label>
                {errors.consentGiven && <span className="error-text">{errors.consentGiven}</span>}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-cancel"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageFormModal;
