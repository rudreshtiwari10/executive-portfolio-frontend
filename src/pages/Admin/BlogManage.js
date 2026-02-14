import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentManage.css';
import './BlogManage.css';

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/blog/admin`, { headers });
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      alert('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter blogs based on status
  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    if (filter === 'published') return blog.status === 'published' && blog.publishedAt && new Date(blog.publishedAt) <= new Date();
    if (filter === 'draft') return blog.status === 'draft';
    if (filter === 'scheduled') return blog.status === 'published' && blog.scheduledFor && new Date(blog.scheduledFor) > new Date();
    return true;
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/blog/admin/${id}`, { headers });
      alert('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (blog) => {
    if (blog.status === 'draft') {
      return <span className="badge badge-draft">Draft</span>;
    }
    if (blog.status === 'published' && blog.publishedAt && new Date(blog.publishedAt) <= new Date()) {
      return <span className="badge badge-published">Published</span>;
    }
    if (blog.status === 'published' && blog.scheduledFor && new Date(blog.scheduledFor) > new Date()) {
      return <span className="badge badge-scheduled">Scheduled</span>;
    }
    return <span className="badge badge-unpublished">Unpublished</span>;
  };

  return (
    <div className="content-manage blog-manage">
      <div className="content-manage-header">
        <div>
          <h1>Manage Blog Posts</h1>
          <p className="subtitle">Create and manage your blog content</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/admin/blog/create')}
        >
          + Create New Post
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({blogs.length})
        </button>
        <button
          className={`tab ${filter === 'published' ? 'active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published ({blogs.filter(b => b.status === 'published' && b.publishedAt && new Date(b.publishedAt) <= new Date()).length})
        </button>
        <button
          className={`tab ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Drafts ({blogs.filter(b => b.status === 'draft').length})
        </button>
        <button
          className={`tab ${filter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled ({blogs.filter(b => b.scheduledFor && new Date(b.scheduledFor) > new Date()).length})
        </button>
      </div>

      {/* Blog List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <p>No blog posts found. Create your first one!</p>
          </div>
        ) : (
          <div className="blog-list">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="blog-list-item">
                {blog.featuredImage?.url && (
                  <div className="blog-thumbnail">
                    <img src={`${API_URL}${blog.featuredImage.url}`} alt={blog.title} />
                  </div>
                )}

                <div className="blog-content">
                  <div className="blog-header">
                    <h3>{blog.title}</h3>
                    {getStatusBadge(blog)}
                    {blog.isFeatured && <span className="badge badge-featured">Featured</span>}
                  </div>

                  {blog.excerpt && (
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  )}

                  <div className="blog-meta">
                    <span>By {blog.author?.username || 'Unknown'}</span>
                    <span>•</span>
                    <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    <span>•</span>
                    <span>{blog.views} views</span>
                    <span>•</span>
                    <span>{blog.readTime} min read</span>
                  </div>

                  {blog.categories && blog.categories.length > 0 && (
                    <div className="blog-tags">
                      {blog.categories.map((cat, idx) => (
                        <span key={idx} className="tag">{cat}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="blog-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(blog._id)}
                  >
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

export default BlogManage;
