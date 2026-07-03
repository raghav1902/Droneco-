/**
 * @file Login.jsx
 * @description Login page for institute staff (Admins and Receptionists).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showExpiredMsg, setShowExpiredMsg] = useState(false);
  
  const { login, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected due to session expiration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setShowExpiredMsg(true);
    }
  }, [location]);

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/receptionist');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShowExpiredMsg(false);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)', // adjust for footer/header if any
      padding: '1rem',
      width: '100%'
    }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--text-primary) 50%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Institute Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage student inquiries</p>
        </div>

        {showExpiredMsg && (
          <div style={{ background: 'var(--warning-glow)', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--warning)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            Your session has expired. Please login again.
          </div>
        )}

        {error && (
          <div style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="reception@institute.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>Demo accounts:</p>
          <p style={{ marginTop: '0.25rem' }}>Admin: <code>admin@institute.com</code> / <code>admin123</code></p>
          <p>Reception: <code>reception@institute.com</code> / <code>reception123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
