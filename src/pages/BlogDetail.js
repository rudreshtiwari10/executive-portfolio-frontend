import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/blog/public/slug/${slug}`);
      const blogData = response.data.data;
      setBlog(blogData);

      // Fetch related blogs (same category)
      if (blogData.categories && blogData.categories.length > 0) {
        const relatedResponse = await axios.get(
          `${API_URL}/api/blog/public?category=${blogData.categories[0]}`
        );
        const related = relatedResponse.data.data
          .filter(b => b._id !== blogData._id)
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      if (error.response?.status === 404) {
        navigate('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="loading">Loading article...</div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navigation />
        <div className="error">Blog post not found</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="blog-detail-page">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{blog.seo?.metaTitle || blog.title}</title>
          <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
          {blog.seo?.keywords && blog.seo.keywords.length > 0 && (
            <meta name="keywords" content={blog.seo.keywords.join(', ')} />
          )}
          <meta property="og:title" content={blog.title} />
          <meta property="og:description" content={blog.excerpt} />
          {blog.featuredImage?.url && (
            <meta property="og:image" content={`${API_URL}${blog.featuredImage.url}`} />
          )}
          <meta property="og:type" content="article" />
        </Helmet>

        {/* Article Header */}
        <article className="blog-article">
          <header className="article-header">
            {blog.categories && blog.categories.length > 0 && (
              <div className="article-categories">
                {blog.categories.map((cat, idx) => (
                  <span key={idx} className="category-tag">{cat}</span>
                ))}
              </div>
            )}

            <h1>{blog.title}</h1>

            <div className="article-meta">
              <span className="author">By {blog.author?.username || 'Admin'}</span>
              <span className="separator">•</span>
              <span className="date">{formatDate(blog.publishedAt)}</span>
              <span className="separator">•</span>
              <span className="read-time">{blog.readTime} min read</span>
              <span className="separator">•</span>
              <span className="views">{blog.views} views</span>
            </div>

            {blog.featuredImage?.url && (
              <div className="featured-image">
                <img src={`${API_URL}${blog.featuredImage.url}`} alt={blog.title} />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Embedded Videos */}
          {blog.videos && blog.videos.length > 0 && (
            <div className="article-videos">
              <h3>Videos</h3>
              {blog.videos.map((video, idx) => (
                <div
                  key={idx}
                  className="video-embed"
                  dangerouslySetInnerHTML={{ __html: video.embedCode }}
                />
              ))}
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="article-tags">
              <strong>Tags:</strong>
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="article-actions">
            <button className="btn-back" onClick={() => navigate('/blog')}>
              ← Back to Blog
            </button>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="related-articles">
            <h2>Related Articles</h2>
            <div className="related-grid">
              {relatedBlogs.map(related => (
                <div
                  key={related._id}
                  className="related-card"
                  onClick={() => navigate(`/blog/${related.slug}`)}
                >
                  {related.featuredImage?.url && (
                    <div className="related-image">
                      <img src={`${API_URL}${related.featuredImage.url}`} alt={related.title} />
                    </div>
                  )}
                  <h3>{related.title}</h3>
                  <p>{related.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogDetail;
