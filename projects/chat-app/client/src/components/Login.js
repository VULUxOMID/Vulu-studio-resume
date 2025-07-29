import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // For demo purposes, we'll create a simple login
        // In a real app, you'd validate against the server
        if (formData.username && formData.password) {
          const userData = {
            username: formData.username,
            email: formData.email || `${formData.username}@example.com`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
          };
          onLogin(userData);
        } else {
          setError('Please fill in all required fields');
        }
      } else {
        // Registration logic would go here
        if (formData.username && formData.email && formData.password) {
          const userData = {
            username: formData.username,
            email: formData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
          };
          onLogin(userData);
        } else {
          setError('Please fill in all fields');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to ChatApp</h1>
          <p>Connect with others in real-time</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <div className="input-icon">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <FaSignInAlt />
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <p><strong>Demo Mode:</strong> Enter any username and password to start chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 