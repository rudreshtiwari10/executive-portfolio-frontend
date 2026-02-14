import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './MessageDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

const MessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Response form
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  // Internal notes
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch message
  const fetchMessage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch message');
      }

      const data = await response.json();
      setMessage(data.data);
      setNotes(data.data.internalNotes || '');

      // If already responded, populate response text
      if (data.data.adminResponse) {
        setResponseText(data.data.adminResponse);
      }

      setError('');

    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Send response
  const handleSendResponse = async (e) => {
    e.preventDefault();

    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    if (!window.confirm('Send this response to ' + message.email + '?')) {
      return;
    }

    try {
      setSendingResponse(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/${id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: responseText })
      });

      if (response.ok) {
        alert('Response sent successfully!');
        setShowResponseForm(false);
        fetchMessage(); // Refresh data
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to send response');
      }

    } catch (err) {
      console.error('Response error:', err);
      alert('Failed to send response');
    } finally {
      setSendingResponse(false);
    }
  };

  // Update status
  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchMessage();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }

    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/${id}/notes`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        alert('Notes saved successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save notes');
      }

    } catch (err) {
      console.error('Notes save error:', err);
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Download attachment
  const handleDownloadAttachment = () => {
    const token = localStorage.getItem('adminToken');
    window.open(`${API_URL}/api/messages/admin/${id}/download?token=${token}`, '_blank');
  };

  // Delete message
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Message deleted successfully');
        navigate('/admin/messages');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete message');
      }

    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete message');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-page">Loading message...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <p>Error: {error}</p>
        <Link to="/admin/messages" className="btn-back">Back to Messages</Link>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="error-page">
        <p>Message not found</p>
        <Link to="/admin/messages" className="btn-back">Back to Messages</Link>
      </div>
    );
  }

  return (
    <div className="message-detail">
      {/* Header */}
      <div className="detail-header">
        <Link to="/admin/messages" className="back-link">← Back to Messages</Link>
        <div className="header-actions">
          <select
            value={message.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="status-selector"
          >
            <option value="New">New</option>
            <option value="Responded">Responded</option>
            <option value="Archived">Archived</option>
          </select>
          <button onClick={handleDelete} className="btn-delete">Delete</button>
        </div>
      </div>

      {/* Message Content */}
      <div className="detail-content">
        {/* Sender Info Card */}
        <div className="info-card">
          <h2>
            {message.fullName}
            {!message.isRead && <span className="unread-badge">New</span>}
          </h2>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">
                <a href={`mailto:${message.email}`}>{message.email}</a>
              </span>
            </div>

            {message.organization && (
              <div className="info-item">
                <span className="label">Organization:</span>
                <span className="value">{message.organization}</span>
              </div>
            )}

            {message.phone && (
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">
                  <a href={`tel:${message.phone}`}>{message.phone}</a>
                </span>
              </div>
            )}

            <div className="info-item">
              <span className="label">Purpose:</span>
              <span className="value">{message.purpose}</span>
            </div>

            {message.purposeDetail && (
              <div className="info-item">
                <span className="label">Details:</span>
                <span className="value">{message.purposeDetail}</span>
              </div>
            )}

            <div className="info-item">
              <span className="label">Submitted:</span>
              <span className="value">{formatDate(message.createdAt)}</span>
            </div>

            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`status-badge ${message.status.toLowerCase()}`}>
                {message.status}
              </span>
            </div>
          </div>
        </div>

        {/* Message Content Card */}
        <div className="message-card">
          <h3>Message</h3>
          <div className="message-text">
            {message.message}
          </div>
        </div>

        {/* Attachment Card */}
        {message.attachment && (
          <div className="attachment-card">
            <h3>Attachment</h3>
            <div className="attachment-info">
              <div className="attachment-details">
                <span className="file-icon">📎</span>
                <div>
                  <div className="file-name">{message.attachment.originalName}</div>
                  <div className="file-meta">
                    {(message.attachment.size / 1024).toFixed(2)} KB •
                    {message.attachment.mimetype}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadAttachment}
                className="btn-download"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* Response Section */}
        <div className="response-section">
          <div className="section-header">
            <h3>Response</h3>
            {!showResponseForm && !message.adminResponse && (
              <button
                onClick={() => setShowResponseForm(true)}
                className="btn-respond"
              >
                Send Response
              </button>
            )}
          </div>

          {message.adminResponse ? (
            <div className="response-content">
              <div className="response-meta">
                Responded by {message.respondedBy?.username || 'Admin'} on{' '}
                {formatDate(message.responseTimestamp)}
              </div>
              <div className="response-text">
                {message.adminResponse}
              </div>
              {!showResponseForm && (
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="btn-edit-response"
                >
                  Send Another Response
                </button>
              )}
            </div>
          ) : showResponseForm ? null : (
            <p className="no-response">No response sent yet</p>
          )}

          {showResponseForm && (
            <form onSubmit={handleSendResponse} className="response-form">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows="8"
                required
              />
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowResponseForm(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-send"
                  disabled={sendingResponse}
                >
                  {sendingResponse ? 'Sending...' : 'Send Response'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Internal Notes Section */}
        <div className="notes-section">
          <h3>Internal Notes</h3>
          <p className="notes-help">These notes are private and not visible to the sender.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes..."
            rows="4"
          />
          <button
            onClick={handleSaveNotes}
            className="btn-save-notes"
            disabled={savingNotes}
          >
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
