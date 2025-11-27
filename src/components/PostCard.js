import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import './PostCard.css';

const PostCard = ({ post, onDelete, currentUser }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setDeleting(true);
        await postAPI.deletePost(post._id);
        if (onDelete) {
          onDelete(post._id);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const isOwner = currentUser?.username === post.author?.username;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <Link
            to={`/profile/${post.author?.username}`}
            className="post-author-link"
          >
            👤 {post.author?.username || 'Unknown User'}
          </Link>
          <span className="post-time">• {formatDate(post.createdAt)}</span>
        </div>
        {isOwner && (
          <button
            className="xp-button delete-btn"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Post"
          >
            {deleting ? '...' : '❌'}
          </button>
        )}
      </div>
      {post.title && (
        <div className="post-title">
          <strong>{post.title}</strong>
        </div>
      )}
      <div className="post-content">{post.content}</div>
      <div className="post-footer">
        <span>💬 Comment</span>
        <span>👍 Like</span>
        <span>📤 Share</span>
      </div>
    </div>
  );
};

export default PostCard;
