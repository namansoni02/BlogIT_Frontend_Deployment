import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">BlogIT</h1>
          <p className="login-tagline">Share your feelings with your friends</p>
        </div>

        <div className="login-content">
          <div className="login-box xp-window">
            <div className="xp-window-header">
              <span className="xp-window-title">Member Login</span>
            </div>
            <div className="xp-window-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username:</label>
                  <input
                    type="text"
                    name="username"
                    className="xp-input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="xp-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {error && <div className="text-error">{error}</div>}

                <div className="form-group mt-20">
                  <button
                    type="submit"
                    className="xp-button xp-button-primary"
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="signup-box xp-window mt-20">
            <div className="xp-window-header">
              <span className="xp-window-title">New User?</span>
            </div>
            <div className="xp-window-content text-center">
              <p style={{ marginBottom: '15px', fontSize: '11px' }}>
                Don't have an account? Join BlogIT today!
              </p>
              <Link to="/register">
                <button className="xp-button">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
