import React, { useState } from 'react';
import { postAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await postAPI.createPost(formData);
      setFormData({ title: '', content: '' });
      if (onPostCreated) {
        onPostCreated(response.data.post);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post xp-window">
      <div className="xp-window-header">
        <span className="xp-window-title">✍️ Create a Post</span>
      </div>
      <div className="xp-window-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              name="title"
              className="xp-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">What's on your mind?</label>
            <textarea
              name="content"
              className="xp-textarea"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              disabled={loading}
              rows="8"
            />
          </div>
          {error && <div className="text-error">{error}</div>}
          <div className="form-group mt-10">
            <button
              type="submit"
              className="xp-button xp-button-primary"
              disabled={loading}
            >
              {loading ? 'Posting...' : '📤 Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
