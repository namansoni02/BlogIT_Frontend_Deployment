import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Set active tab based on current location
    if (location.pathname === '/dashboard') {
      setActiveTab('home');
    } else if (location.pathname === '/create-post') {
      setActiveTab('create');
    } else if (location.pathname === '/users') {
      setActiveTab('users');
    }
  }, [location]);

  useEffect(() => {
    // Check for notifications every 30 seconds
    const checkNotifications = async () => {
      try {
        const response = await userAPI.getFollowNotifications();
        const newNotifications = response.data.notifications || [];
        setNotificationCount(newNotifications.length);
        if (newNotifications.length > 0) {
          setNotifications(newNotifications);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (user) {
      checkNotifications();
      const interval = setInterval(checkNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationUserClick = (username) => {
    setShowNotifications(false);
    setNotifications([]);
    setNotificationCount(0);
    navigate(`/profile/${username}`);
  };

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="nav-bar">
      <div className="nav-left">
        <div className="logo">BlogIT</div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home', '/dashboard')}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabClick('create', '/create-post')}
          >
            ✍️ Create Post
          </button>
          <button 
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabClick('users', '/users')}
          >
            👥 Users
          </button>
        </div>
      </div>
      <div className="nav-links">
        <Link to={`/profile/${user?.username}`} className="nav-link">
          👤 My Profile
        </Link>
        
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={handleNotificationClick}
          >
            🔔
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>

          {showNotifications && notifications.length > 0 && (
            <div className="notification-dropdown xp-window">
              <div className="xp-window-header">
                <span className="xp-window-title">New Followers</span>
                <button 
                  className="close-btn-notification"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className="notification-item"
                    onClick={() => handleNotificationUserClick(notif.username)}
                  >
                    <div className="notification-avatar">
                      {notif.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="notification-username">
                      {notif.username} started following you
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="xp-button" style={{ fontSize: '11px' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
