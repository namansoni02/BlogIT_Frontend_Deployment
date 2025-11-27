import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import './CreatePostPage.css';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    // Navigate to home after creating a post
    navigate('/dashboard');
  };

  return (
    <div className="create-post-page">
      <Navbar />
      <div className="create-post-container">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
};

export default CreatePostPage;
