import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    images: [],
    videos: [],
    categories: [],
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    status: 'draft',
    publishedAt: '',
    scheduledFor: '',
    isFeatured: false
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
  const token = localStorage.getItem('adminToken');
  const headers = { 'Authorization': `Bearer ${token}` };

  // Fetch blog if editing
  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/blog/admin/${id}`, { headers });
      const blog = response.data.data;

      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || null,
        images: blog.images || [],
        videos: blog.videos || [],
        categories: blog.categories || [],
        tags: blog.tags || [],
        seo: blog.seo || { metaTitle: '', metaDescription: '', keywords: [] },
        status: blog.status || 'draft',
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 16) : '',
        scheduledFor: blog.scheduledFor ? new Date(blog.scheduledFor).toISOString().slice(0, 16) : '',
        isFeatured: blog.isFeatured || false
      });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      alert('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle content change (ReactQuill)
  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await axios.post(
        `${API_URL}/api/blog/admin/upload-image`,
        uploadFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
      return null;
    }
  };

  // Handle featured image selection
  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await handleImageUpload(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        featuredImage: { url, alt: formData.title }
      }));
    }
  };

  // Add video
  const addVideo = () => {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, { url, title: '' }]
      }));
    }
  };

  // Remove video
  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  // Handle category/tag input
  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    const arr = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  // Handle SEO changes
  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'keywords') {
      const keywords = value.split(',').map(k => k.trim()).filter(k => k);
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, keywords }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [name]: value }
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Log the data being sent for debugging
      console.log('Submitting blog data:', formData);

      if (isEditing) {
        const response = await axios.put(
          `${API_URL}/api/blog/admin/${id}`,
          formData,
          { headers: { ...headers, 'Content-Type': 'application/json' } }
        );
        console.log('Update response:', response.data);
        alert('Blog updated successfully!');
      } else {
        const response = await axios.post(
          `${API_URL}/api/blog/admin`,
          formData,
          { headers: { ...headers, 'Content-Type': 'application/json' } }
        );
        console.log('Create response:', response.data);
        alert('Blog created successfully!');
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Failed to save blog:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert('Failed to save blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  if (loading && isEditing) {
    return <div className="loading">Loading blog...</div>;
  }

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h1>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        <button className="btn-secondary" onClick={() => navigate('/admin/blog')}>
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Content Section */}
        <div className="editor-section">
          <h2>Main Content</h2>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              required
              placeholder="Enter blog post title"
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <div className="slug-input-group">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="url-friendly-slug (auto-generated if left empty)"
              />
              <button type="button" className="btn-secondary" onClick={generateSlug}>
                Generate from Title
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Excerpt (Short Summary)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              maxLength="300"
              placeholder="Brief summary for listing pages (max 300 characters)"
            />
            <small>{formData.excerpt.length}/300 characters</small>
          </div>

          <div className="form-group">
            <label>Content *</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write your blog content here..."
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="editor-section">
          <h2>Media</h2>

          <div className="form-group">
            <label>Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageChange}
            />
            {formData.featuredImage?.url && (
              <div className="image-preview">
                <img src={`${API_URL}${formData.featuredImage.url}`} alt="Featured" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Videos (YouTube/Vimeo)</label>
            <button type="button" className="btn-secondary" onClick={addVideo}>
              + Add Video
            </button>
            {formData.videos.length > 0 && (
              <div className="video-list">
                {formData.videos.map((video, idx) => (
                  <div key={idx} className="video-item">
                    <input
                      type="text"
                      value={video.url}
                      readOnly
                      placeholder="Video URL"
                    />
                    <button type="button" className="btn-delete" onClick={() => removeVideo(idx)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Organization Section */}
        <div className="editor-section">
          <h2>Organization</h2>

          <div className="form-group">
            <label>Categories (comma-separated)</label>
            <input
              type="text"
              value={formData.categories.join(', ')}
              onChange={(e) => handleArrayInput(e, 'categories')}
              placeholder="Technology, Web Development, AI"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInput(e, 'tags')}
              placeholder="react, nodejs, tutorial"
            />
          </div>
        </div>

        {/* SEO Section */}
        <div className="editor-section">
          <h2>SEO Settings</h2>

          <div className="form-group">
            <label>Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleSeoChange}
              placeholder="Leave blank to use blog title"
            />
          </div>

          <div className="form-group">
            <label>Meta Description (max 160 characters)</label>
            <textarea
              name="metaDescription"
              value={formData.seo.metaDescription}
              onChange={handleSeoChange}
              rows="2"
              maxLength="160"
              placeholder="SEO-friendly description for search engines"
            />
            <small>{formData.seo.metaDescription?.length || 0}/160 characters</small>
          </div>

          <div className="form-group">
            <label>Keywords (comma-separated)</label>
            <input
              type="text"
              name="keywords"
              value={formData.seo.keywords?.join(', ') || ''}
              onChange={handleSeoChange}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Publishing Section */}
        <div className="editor-section">
          <h2>Publishing</h2>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          {formData.status === 'published' && (
            <div className="form-group">
              <label>Publish Date & Time (leave blank for immediate)</label>
              <input
                type="datetime-local"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Mark as Featured</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="editor-actions">
          <button type="submit" className="btn-success" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Blog' : 'Create Blog')}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/blog')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
