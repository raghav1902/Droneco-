/**
 * @file Login.jsx
 * @description Login page for institute staff (Admins and Receptionists).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authLoginSchema, validateForm } from '../../utils/validators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showExpiredMsg, setShowExpiredMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      if (user.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/receptionist');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setShowExpiredMsg(false);

    const validation = validateForm(authLoginSchema, { email, password });
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* BEGIN: Branding Sidebar */}
      <aside className="hidden md:flex md:w-1/3 lg:w-2/5 bg-[#0a4d48] text-white p-12 flex-col justify-between relative overflow-hidden" data-purpose="branding-sidebar">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Droneco</h1>
          <div className="h-1 w-12 bg-teal-400 mb-8"></div>
          <p className="text-xl text-teal-50 font-medium max-w-sm leading-relaxed">
            Streamlining student inquiry management with professional precision.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-teal-200/60 font-medium uppercase tracking-widest">Enterprise Inquiry Portal</p>
        </div>
        {/* Subtle Geometric Background Decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-teal-900/50 rounded-full blur-3xl"></div>
      </aside>
      {/* END: Branding Sidebar */}
      
      {/* BEGIN: Main Login Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50" data-purpose="login-container">
        <div className="w-full max-w-md" id="login-card">
          {/* Mobile Header (Visible only on small screens) */}
          <header className="md:hidden mb-12 text-center">
            <h1 className="text-3xl font-black text-[#0a4d48] mb-2">Droneco</h1>
            <p className="text-slate-500 font-medium">Student Inquiry Management</p>
          </header>

          <div className="bg-white border border-slate-200 shadow-xl rounded-sm p-8 sm:p-12 animate-fade-in">
            {/* BEGIN: Form Header */}
            <header className="mb-10">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-500 text-sm mt-1">Enter your credentials to access the dashboard</p>
            </header>
            {/* END: Form Header */}

            {showExpiredMsg && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-sm mb-6 text-sm">
                Your session has expired. Please login again.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
                {error}
              </div>
            )}

            {/* BEGIN: LoginForm */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input Field */}
              <div data-purpose="input-group-email">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-2" htmlFor="email">
                  Professional Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="reception@droneco.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400 text-sm"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({...prev, email: null})) }}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Password Input Field */}
              <div data-purpose="input-group-password">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-widest" htmlFor="password">
                    Security Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400 text-sm pr-10"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({...prev, password: null})) }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#117a72] hover:bg-[#0e635c] text-white font-bold py-4 px-4 rounded-sm transition-all duration-200 mt-2 shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 uppercase text-xs tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                data-purpose="submit-button"
              >
                {loading ? 'Accessing...' : 'Access Dashboard'}
              </button>
            </form>
            {/* END: LoginForm */}

            {/* BEGIN: DemoAccounts */}
            <footer className="mt-12 pt-8 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
                <p className="text-[10px] text-slate-400 mb-3 font-bold uppercase tracking-widest text-center">System Access Keys</p>
                <div className="space-y-2">
                  {/* Admin Credentials */}
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700">Administrator</span>
                    <span className="text-slate-500 font-mono">admin@institute.com / admin123</span>
                  </div>
                  {/* Reception Credentials */}
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700">Reception</span>
                    <span className="text-slate-500 font-mono">reception@institute.com / reception123</span>
                  </div>
                </div>
              </div>
            </footer>
            {/* END: DemoAccounts */}
          </div>

          <p className="mt-8 text-center text-[11px] text-slate-400 font-medium">
            © 2026 Droneco Student Services. All rights reserved.
          </p>
        </div>
      </main>
      {/* END: Main Login Content */}
    </div>
  );
};

export default Login;
