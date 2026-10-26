import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { registerUser } from '../utils/store';

const Register = () => {
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    university: '',
    program: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    // Frontend validations
    if (!form.fullName.trim())    return setError('Full name is required.');
    if (!form.email.trim())       return setError('Email is required.');
    if (!form.university.trim())  return setError('University is required.');
    if (!form.program.trim())     return setError('Program is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!form.agreed)             return setError('Please agree to Terms of Service.');

    try {
      setLoading(true);
      console.log('📤 Sending register request...');

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:   form.fullName,
          email:      form.email,
          university: form.university,
          program:    form.program,
          password:   form.password,
        }),
      });

      console.log('📥 Response status:', res.status);
      const data = await res.json();
      console.log('📥 Response data:', data);

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      // Save to localStorage
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Register in store for admin dashboard
registerUser({ name: form.fullName, email: form.email, dept: form.program });

      setSuccess('Account created! Redirecting...');

      console.log('✅ Role:', data.user.role);

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />

      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <span className="auth-logo-icon">F</span>
          <span className="auth-logo-text">FORMATIFY</span>
        </div>
        <div className="auth-left-content">
          <h1>
            Start Your Journey <br /> to <br />
            <span className="red">Perfect Formatting</span>
          </h1>
          <p>Join thousands of students who format their reports perfectly.</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-card-sub">Join thousands of students using Formatify</p>

          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" type="text" placeholder="Hari**"
              value={form.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email"
              placeholder="student@kristujayanti.com"
              value={form.email} onChange={handleChange} />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>University</label>
              <input name="university" type="text" placeholder="University name"
                value={form.university} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Program</label>
              <input name="program" type="text" placeholder="MCA / BCA"
                value={form.program} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password} onChange={handleChange} />
              <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirmPassword} onChange={handleChange} />
              <button className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <label className="checkbox-label terms-label">
            <input type="checkbox" name="agreed"
              checked={form.agreed} onChange={handleChange} />
            <span>
              I agree to the <span className="red-link">Terms of Service</span>{' '}
              and <span className="red-link">Privacy Policy</span>
            </span>
          </label>

          <button
            className="auth-submit-btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account?{' '}
            <span className="red-link" onClick={() => navigate('/login')}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;