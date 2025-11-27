import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postAPI, userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [userPostCount, setUserPostCount] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Fetch all posts without pagination for scrollable feed
      const response = await postAPI.getAllPosts(1, 100);
      setPosts(response.data.posts || []);
      
      // Count user's posts
      const userPosts = response.data.posts.filter(p => p.author?.username === user?.username);
      setUserPostCount(userPosts.length);
      
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await userAPI.getAllUsers();
      console.log('Users API response:', response.data);
      setAllUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAllUsers();
  }, []);

  const fetchQuote = async () => {
    try {
      setQuoteLoading(true);
      
      // Check if we have a cached quote from this hour
      const cachedQuote = localStorage.getItem('cachedQuote');
      const cachedTime = localStorage.getItem('cachedQuoteTime');
      const currentHour = new Date().getHours();
      const currentDate = new Date().toDateString();
      
      if (cachedQuote && cachedTime) {
        const cached = JSON.parse(cachedTime);
        if (cached.hour === currentHour && cached.date === currentDate) {
          // Use cached quote if it's from the same hour
          setQuote(JSON.parse(cachedQuote));
          setQuoteLoading(false);
          return;
        }
      }
      
      // Fetch new quote
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: {
          'X-Api-Key': process.env.REACT_APP_QUOTES_API_KEY
        }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0]);
        // Cache the quote with current hour
        localStorage.setItem('cachedQuote', JSON.stringify(data[0]));
        localStorage.setItem('cachedQuoteTime', JSON.stringify({
          hour: currentHour,
          date: currentDate
        }));
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handlePostCreated = (newPost) => {
    // Refresh posts to show the new post
    fetchPosts();
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    // Refresh posts after deletion
    fetchPosts();
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-content-single">
        {/* News Feed - Full Width */}
        <div className="news-feed-column-full">
          <div className="xp-window">
            <div className="xp-window-header">
              <span className="xp-window-title">📰 News Feed</span>
            </div>
            <div className="xp-window-content news-feed-home-scroll">
              {loading ? (
                <div className="text-center p-20">
                  <div className="loading"></div>
                  <p style={{ marginTop: '10px', fontSize: '11px' }}>
                    Loading posts...
                  </p>
                </div>
              ) : error ? (
                <div className="text-error text-center p-20">{error}</div>
              ) : posts.length === 0 ? (
                <div className="text-center p-20" style={{ fontSize: '11px' }}>
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handlePostDeleted}
                    currentUser={user}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
