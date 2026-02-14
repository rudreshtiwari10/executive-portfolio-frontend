import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MessagesManage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

const MessagesManage = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, responded: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Build query params
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy: sortBy
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`${API_URL}/api/messages/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data.messages);
      setTotalPages(data.data.totalPages);
      setError('');

    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_URL}/api/messages/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }

    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, sortBy]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMessages();
  };

  // Delete message
  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete the message from ${fullName}?`)) {
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
        fetchMessages();
        fetchStats();
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-manage">
      <div className="page-header">
        <h1>Messages</h1>
        <p>Manage messages from visitors</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Messages</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card new">
          <div className="stat-label">New</div>
          <div className="stat-value">{stats.new}</div>
        </div>
        <div className="stat-card responded">
          <div className="stat-label">Responded</div>
          <div className="stat-value">{stats.responded}</div>
        </div>
        <div className="stat-card archived">
          <div className="stat-label">Archived</div>
          <div className="stat-value">{stats.archived}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name, email, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Responded">Responded</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="fullName">Name (A-Z)</option>
            <option value="-fullName">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {/* Messages List */}
      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages found</p>
        </div>
      ) : (
        <>
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message-card ${!message.isRead ? 'unread' : ''}`}
              >
                <div className="message-header">
                  <div className="message-info">
                    <h3>{message.fullName}</h3>
                    {!message.isRead && <span className="unread-badge">New</span>}
                    <span className={`status-badge ${message.status.toLowerCase()}`}>
                      {message.status}
                    </span>
                  </div>
                  <div className="message-date">
                    {formatDate(message.createdAt)}
                  </div>
                </div>

                <div className="message-details">
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{message.email}</span>
                  </div>
                  {message.organization && (
                    <div className="detail-row">
                      <span className="label">Organization:</span>
                      <span className="value">{message.organization}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Purpose:</span>
                    <span className="value">{message.purpose}</span>
                  </div>
                </div>

                <div className="message-preview">
                  {message.message.substring(0, 150)}
                  {message.message.length > 150 ? '...' : ''}
                </div>

                {message.attachment && (
                  <div className="attachment-indicator">
                    📎 Attachment: {message.attachment.originalName}
                  </div>
                )}

                <div className="message-actions">
                  <Link
                    to={`/admin/messages/${message._id}`}
                    className="btn-view"
                  >
                    View & Respond
                  </Link>
                  <button
                    onClick={() => handleDelete(message._id, message.fullName)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessagesManage;
