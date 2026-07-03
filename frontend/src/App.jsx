/**
 * @file App.jsx
 * @description Main application routing and shell.
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import StudentForm from './forms/StudentForm';
import Login from './pages/auth/Login';
import logo from './assets/Droneco.jpg';
import ReceptionistDashboard from './receptionist/ReceptionistDashboard';
import AdminDashboard from './admin/AdminDashboard';

// Shared Layout Header/Navbar
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-theme'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    } else {
      document.body.classList.remove('dark-theme');
      setIsDark(false);
    }
  }, []);

  const handleToggleTheme = () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Hide navbar on the student QR form landing page to prevent students from seeing staff portals
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Droneco Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
        <span>Droneco</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Student Form</Link>
        {!isAuthenticated ? (
          <Link to="/login" className="navbar-link">Staff Portal</Link>
        ) : (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" className="navbar-link">Admin Panel</Link>
            ) : (
              <Link to="/receptionist" className="navbar-link">Counselor Desk</Link>
            )}
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Sign Out
            </button>
          </>
        )}
        <button
          onClick={handleToggleTheme}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            fontSize: '1.15rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: '50%',
            transition: 'var(--transition)',
            marginLeft: '0.5rem',
            outline: 'none',
            width: '36px',
            height: '36px'
          }}
          title="Toggle dark/light theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if role is incorrect
    return <Navigate to={user.role === 'admin' ? '/admin' : '/receptionist'} replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Student Wizard Form */}
              <Route path="/" element={<StudentForm />} />

              {/* Staff Login */}
              <Route path="/login" element={<Login />} />

              {/* Receptionist Dashboard (Accessible by receptionist & admin) */}
              <Route
                path="/receptionist"
                element={
                  <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                    <ReceptionistDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard (Accessible by admin only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
