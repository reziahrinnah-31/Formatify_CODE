import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setSuccess('');

    if (!email.trim())    return setError('Email is required.');
    if (!password.trim()) return setError('Password is required.');

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('✅ Login successful! Redirecting...');

      setTimeout(() => {
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1500);

    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />

      <div className="auth-left">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <span className="auth-logo-icon">F</span>
          <span className="auth-logo-text">FORMATIFY</span>
        </div>
        <div className="auth-left-content">
          <h1>
            Welcome Back to <br />
            <span className="red">Academic <br /> Excellence</span>
          </h1>
          <p>Sign in to access your formatted documents and continue working on your projects.</p>
          <ul className="auth-perks">
            <li><div className="perk-icon">📄</div>Access your documents</li>
            <li><div className="perk-icon">📄</div>Save formatting preferences</li>
            <li><div className="perk-icon">📄</div>Track formatting history</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-card-sub">Enter your credentials to access your account</p>

          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="student@kristujayanti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <span className="forgot-link" onClick={() => navigate('/forgot-password')}>
  Forgot password?
</span>
          </div>

          <button
            className="auth-submit-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <span className="red-link" onClick={() => navigate('/register')}>
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;