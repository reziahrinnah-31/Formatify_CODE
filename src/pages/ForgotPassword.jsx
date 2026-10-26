import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) return setError('Email is required.');

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-right" style={{ margin: '0 auto' }}>
        <div className="auth-card">
          <h2>Forgot Password</h2>
          <p className="auth-card-sub">Enter your email and we'll send you a reset link</p>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="student@kristujayanti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="auth-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="auth-switch">
            Remembered your password?{' '}
            <span className="red-link" onClick={() => navigate('/login')}>
              Back to Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;