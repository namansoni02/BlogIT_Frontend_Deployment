import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch user profile and posts
        const response = await userAPI.getUserProfile(username);
        setProfileUser(response.data.user);
        setPosts(response.data.posts || []);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  const handleShowFollowers = async () => {
    if (!isOwnProfile) return;
    
    if (showFollowers) {
      setShowFollowers(false);
      return;
    }

    try {
      const response = await userAPI.getFollowers();
      setFollowers(response.data.followers);
      setShowFollowers(true);
      setShowFollowing(false);
    } catch (err) {
      console.error('Error fetching followers:', err);
      alert('Failed to load followers');
    }
  };

  const handleShowFollowing = async () => {
    if (!isOwnProfile) return;
    
    if (showFollowing) {
      setShowFollowing(false);
      return;
    }

    try {
      const response = await userAPI.getFollowing();
      setFollowing(response.data.following);
      setShowFollowing(true);
      setShowFollowers(false);
    } catch (err) {
      console.error('Error fetching following:', err);
      alert('Failed to load following');
    }
  };

  const handleFollow = async () => {
    if (!profileUser) return;

    try {
      setFollowLoading(true);
      const isFollowing = profileUser.followers?.includes(currentUser._id);

      if (isFollowing) {
        await userAPI.unfollowUser(profileUser._id);
        setProfileUser({
          ...profileUser,
          followers: profileUser.followers.filter((id) => id !== currentUser._id),
        });
      } else {
        await userAPI.followUser(profileUser._id);
        setProfileUser({
          ...profileUser,
          followers: [...(profileUser.followers || []), currentUser._id],
        });
      }
    } catch (err) {
      console.error('Error following/unfollowing:', err);
      alert('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="container">
          <div className="text-center p-20">
            <div className="loading"></div>
            <p style={{ marginTop: '10px', fontSize: '11px' }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="container">
          <div className="xp-window">
            <div className="xp-window-header">
              <span className="xp-window-title">Error</span>
            </div>
            <div className="xp-window-content">
              <p className="text-error text-center">{error || 'User not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFollowing = profileUser.followers?.includes(currentUser._id);

  return (
    <div className="profile-page">
      <Navbar />

      <div className="container">
        <div className="profile-header xp-window">
          <div className="xp-window-header">
            <span className="xp-window-title">👤 User Profile</span>
          </div>
          <div className="xp-window-content">
            <div className="profile-info">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {profileUser.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="profile-details">
                <h2 className="profile-username">{profileUser.username}</h2>
                <p className="profile-email">{profileUser.email}</p>
                <div className="profile-stats">
                  <span>
                    <strong>{posts.length}</strong> Posts
                  </span>
                  <span 
                    onClick={handleShowFollowers}
                    style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
                    className={isOwnProfile ? 'clickable-stat' : ''}
                  >
                    <strong>{profileUser.followers?.length || 0}</strong> Followers
                  </span>
                  <span 
                    onClick={handleShowFollowing}
                    style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
                    className={isOwnProfile ? 'clickable-stat' : ''}
                  >
                    <strong>{profileUser.following?.length || 0}</strong> Following
                  </span>
                </div>
                {!isOwnProfile && (
                  <button
                    className={`xp-button ${
                      isFollowing ? '' : 'xp-button-primary'
                    } mt-10`}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading
                      ? '...'
                      : isFollowing
                      ? 'Unfollow'
                      : '➕ Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isOwnProfile && showFollowers && (
          <div className="profile-friends xp-window mt-20">
            <div className="xp-window-header">
              <span className="xp-window-title">👥 Followers</span>
              <button 
                className="close-btn"
                onClick={() => setShowFollowers(false)}
              >
                ✕
              </button>
            </div>
            <div className="xp-window-content">
              {followers.length === 0 ? (
                <div className="text-center p-20" style={{ fontSize: '11px' }}>
                  <p>No followers yet.</p>
                </div>
              ) : (
                <div className="friends-list">
                  {followers.map((follower) => (
                    <div key={follower._id} className="friend-item">
                      <div className="friend-avatar">
                        {follower.username.charAt(0).toUpperCase()}
                      </div>
                      <a 
                        href={`/profile/${follower.username}`}
                        className="friend-username"
                      >
                        {follower.username}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isOwnProfile && showFollowing && (
          <div className="profile-friends xp-window mt-20">
            <div className="xp-window-header">
              <span className="xp-window-title">👥 Following</span>
              <button 
                className="close-btn"
                onClick={() => setShowFollowing(false)}
              >
                ✕
              </button>
            </div>
            <div className="xp-window-content">
              {following.length === 0 ? (
                <div className="text-center p-20" style={{ fontSize: '11px' }}>
                  <p>Not following anyone yet.</p>
                </div>
              ) : (
                <div className="friends-list">
                  {following.map((followingUser) => (
                    <div key={followingUser._id} className="friend-item">
                      <div className="friend-avatar">
                        {followingUser.username.charAt(0).toUpperCase()}
                      </div>
                      <a 
                        href={`/profile/${followingUser.username}`}
                        className="friend-username"
                      >
                        {followingUser.username}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-posts xp-window mt-20">
          <div className="xp-window-header">
            <span className="xp-window-title">
              📝 {isOwnProfile ? 'Your' : `${profileUser.username}'s`} Posts
            </span>
          </div>
          <div className="xp-window-content">
            {posts.length === 0 ? (
              <div className="text-center p-20" style={{ fontSize: '11px' }}>
                <p>No posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handlePostDeleted}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
