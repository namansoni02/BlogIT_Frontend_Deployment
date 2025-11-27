import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-logo">BlogIT</h1>
          <p className="register-tagline">Share your feelings with your friends</p>
        </div>

        <div className="register-content">
          <div className="register-box xp-window">
            <div className="xp-window-header">
              <span className="xp-window-title">Sign Up for BlogIT</span>
            </div>
            <div className="xp-window-content">
              <p style={{ marginBottom: '15px', fontSize: '11px', color: '#000080' }}>
                It's free and always will be.
              </p>

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
                    minLength={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    className="xp-input"
                    value={formData.email}
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
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="xp-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                {error && <div className="text-error">{error}</div>}
                {success && <div className="text-success">{success}</div>}

                <div className="form-group mt-20">
                  <button
                    type="submit"
                    className="xp-button xp-button-primary"
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-20">
                <Link to="/login" style={{ fontSize: '11px', color: '#0055E5' }}>
                  Already have an account? Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
