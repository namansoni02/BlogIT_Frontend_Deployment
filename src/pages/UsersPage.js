import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './UsersPage.css';

const UsersPage = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers();
  }, []);

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

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="users-page">
      <Navbar />
      
      <div className="users-content">
        <div className="xp-window">
          <div className="xp-window-header">
            <span className="xp-window-title">👥 Users on Platform</span>
          </div>
          <div className="xp-window-content users-page-scroll">
            {usersLoading ? (
              <div className="text-center p-20">
                <div className="loading"></div>
                <p style={{ marginTop: '10px', fontSize: '11px' }}>
                  Loading users...
                </p>
              </div>
            ) : allUsers.length === 0 ? (
              <p style={{ fontSize: '10px' }}>No users found</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {allUsers.map((u) => (
                  <li
                    key={u._id}
                    onClick={() => handleUserClick(u.username)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      border: '1px solid #0054E3',
                      backgroundColor: '#ECE9D8',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#316AC5';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ECE9D8';
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    <span style={{ 
                      backgroundColor: '#0054E3',
                      color: 'white',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {u.username.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{u.username}</div>
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                        {u.followers?.length || 0} followers
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
