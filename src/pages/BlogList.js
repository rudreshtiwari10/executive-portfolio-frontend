import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DynamicIslandNav from '../components/DynamicIslandNav';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

  // Trigger visibility animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Fetch published blogs
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/blog/public`);
      setBlogs(response.data.data || []);
      setFilteredBlogs(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blog/public/categories`);
      setCategories(['all', ...(response.data.data || [])]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Filter blogs by category and search
  useEffect(() => {
    let result = blogs;

    if (selectedCategory !== 'all') {
      result = result.filter(blog => blog.categories?.includes(selectedCategory));
    }

    if (searchTerm) {
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(result);
  }, [selectedCategory, searchTerm, blogs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <DynamicIslandNav />
      <div className={`blog-list-page ${isVisible ? 'visible' : ''}`}>
        {/* Background Elements */}
        <div className="blog-pattern" />
        <div className="blog-gradient" />
        {/* Header */}
        <header className="blog-header">
          <div className="section-label">
            <span className="label-line" />
            <span className="label-text">INSIGHTS</span>
            <span className="label-line" />
          </div>
          <h1 className="section-title">Thought Leadership</h1>
          <p className="section-subtitle">Insights, perspectives, and industry expertise from a visionary CEO</p>
        </header>

        {/* Search and Filter */}
        <div className="blog-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <p>No blog posts found</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map(blog => (
              <Link to={`/blog/${blog.slug}`} key={blog._id} className="blog-card">
                {blog.featuredImage?.url && (
                  <div className="blog-card-image">
                    <img src={`${API_URL}${blog.featuredImage.url}`} alt={blog.title} />
                    {blog.isFeatured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>
                )}

                <div className="blog-card-content">
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="blog-card-categories">
                      {blog.categories.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  )}

                  <h2>{blog.title}</h2>

                  {blog.excerpt && (
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                  )}

                  <div className="blog-card-meta">
                    <span className="author">By {blog.author?.username || 'Admin'}</span>
                    <span className="separator">•</span>
                    <span className="date">{formatDate(blog.publishedAt)}</span>
                    <span className="separator">•</span>
                    <span className="read-time">{blog.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;
