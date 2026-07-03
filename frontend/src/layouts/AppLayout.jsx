import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Droneco.jpg';

const AppLayout = ({ role, activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();
  
  // Theme State
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-theme') || document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme', 'dark');
      setIsDark(true);
    } else {
      document.body.classList.remove('dark-theme', 'dark');
      setIsDark(false);
    }
  }, []);

  const handleToggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme', 'dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const adminTabs = [
    { id: 'analytics', label: 'Lead Analytics' },
    { id: 'leads', label: 'Student Leads' },
    { id: 'courses', label: 'Manage Courses' },
    { id: 'questions', label: 'Questions' },
    { id: 'fee_dashboard', label: 'Fee Dashboard' },
    { id: 'fee_structure', label: 'Fee Structure' },
    { id: 'fee_rules', label: 'Fee Rules' },
    { id: 'discounts', label: 'Discounts' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  const receptionistTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leads', label: 'Student Leads' },
    { id: 'admission-wizard', label: 'Admission Wizard' },
    { id: 'students', label: 'Students' },
    { id: 'collect-fee', label: 'Collect Fee' },
    { id: 'payment-history', label: 'Payment History' },
    { id: 'due-list', label: 'Due List' },
    { id: 'settings', label: 'Settings' }
  ];

  const tabs = role === 'admin' ? adminTabs : receptionistTabs;
  const title = role === 'admin' ? 'Management Dashboard' : 'Counselor Desk';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-app)' }}>
      {/* Top Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="Droneco Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Droneco</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <a href="/" style={{ cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='var(--text-main)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Student Form</a>
          <a href={role === 'admin' ? '/admin' : '/receptionist'} style={{ cursor: 'pointer', color: 'var(--text-main)', fontWeight: 500, textDecoration: 'none' }}>
            {role === 'admin' ? 'Admin Panel' : 'Counselor Desk'}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='var(--danger)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Sign Out</a>
          <button 
            onClick={handleToggleTheme}
            style={{ 
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
              borderRadius: '50%', width: '36px', height: '36px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-main)', cursor: 'pointer', outline: 'none'
            }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '2.5rem', maxWidth: '1600px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome back, {user?.name || 'User'} ({user?.role || role})
          </p>
        </div>

        {/* Horizontal Tabs */}
        {activeTab && setActiveTab && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--accent-hex)' : 'var(--bg-surface)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(15, 118, 110, 0.3)' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Content */}
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
