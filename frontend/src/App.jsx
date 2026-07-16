/**
 * @file App.jsx
 * @description Main application routing and shell.
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentForm from './forms/StudentForm';
import Login from './pages/auth/Login';
import logo from './assets/Droneco.jpg';
import ReceptionistDashboard from './receptionist/ReceptionistDashboard';
import AdminDashboard from './admin/AdminDashboard';

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

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role.toLowerCase()))) {
    // Redirect to their default dashboard if role is incorrect
    return <Navigate to={user?.role?.toLowerCase() === 'admin' ? '/admin' : '/receptionist'} replace />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme', 'dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container">
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Professional Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Student Wizard Form */}
              <Route path="/apply" element={<StudentForm />} />

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
