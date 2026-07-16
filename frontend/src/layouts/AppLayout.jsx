import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, LogOut, ChevronRight, Menu, X,
  BarChart2, Activity, Users, UserPlus, 
  GraduationCap, BookOpen, HelpCircle, 
  PieChart, IndianRupee, History, AlertCircle, 
  FileText, Settings, LayoutDashboard, FormInput
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/Droneco.jpg';

const AppLayout = ({ role, activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const adminNav = [
    {
      category: 'Overview',
      items: [
        { id: 'analytics', label: 'Lead Analytics', icon: BarChart2 },
        { id: 'daily-operations', label: 'Daily Operations', icon: Activity }
      ]
    },
    {
      category: 'Admissions',
      items: [
        { id: 'leads', label: 'Student Leads', icon: Users },
        { id: 'admission-wizard', label: 'Admission Wizard', icon: UserPlus }
      ]
    },
    {
      category: 'Academics',
      items: [
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'courses', label: 'Manage Courses', icon: BookOpen },
        { id: 'questions', label: 'Questions', icon: HelpCircle }
      ]
    },
    {
      category: 'Finance',
      items: [
        { id: 'fee_dashboard', label: 'Fee Dashboard', icon: PieChart },
        { id: 'collect-fee', label: 'Collect Fee', icon: IndianRupee },
        { id: 'payment-history', label: 'Payment History', icon: History },
        { id: 'due-list', label: 'Due List', icon: AlertCircle }
      ]
    },
    {
      category: 'System',
      items: [
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const receptionistNav = [
    {
      category: 'Overview',
      items: [
        { id: 'daily-operations', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      category: 'Admissions',
      items: [
        { id: 'leads', label: 'Student Leads', icon: Users },
        { id: 'admission-wizard', label: 'Admission Wizard', icon: UserPlus }
      ]
    },
    {
      category: 'Academics',
      items: [
        { id: 'students', label: 'Students', icon: GraduationCap }
      ]
    },
    {
      category: 'Finance',
      items: [
        { id: 'collect-fee', label: 'Collect Fee', icon: IndianRupee },
        { id: 'payment-history', label: 'Payment History', icon: History },
        { id: 'due-list', label: 'Due List', icon: AlertCircle }
      ]
    },
    {
      category: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const navConfig = role === 'admin' ? adminNav : receptionistNav;
  const title = role === 'admin' ? 'Management Dashboard' : 'Counselor Desk';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      {/* Sidebar Navigation */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex flex-col z-20 shrink-0`}
        style={{ 
          background: 'var(--bg-primary)', 
          borderRight: '1px solid var(--border-color)' 
        }}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className={`flex items-center gap-3 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <img src={logo} alt="Droneco Logo" className="h-8 w-auto rounded" />
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Droneco</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors mx-auto">
            <Menu size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6 custom-scrollbar">
          {navConfig.map((group, idx) => (
            <div key={idx}>
              {isSidebarOpen && (
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {group.category}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab && setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group w-full text-left`}
                      style={{
                        background: isActive ? 'var(--accent-hex)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                      title={!isSidebarOpen ? item.label : ''}
                    >
                      <Icon size={18} className="shrink-0" style={{ color: isActive ? '#ffffff' : 'var(--text-secondary)' }} />
                      {isSidebarOpen && (
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Links */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-color)' }}>
          <a
            href="/apply"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group w-full text-left"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            title={!isSidebarOpen ? 'Student Form' : ''}
          >
            <FormInput size={18} className="shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">Student Form</span>}
          </a>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header 
          className="h-16 flex items-center justify-between px-6 z-10 shrink-0"
          style={{ 
            background: 'var(--bg-primary)', 
            borderBottom: '1px solid var(--border-color)' 
          }}
        >
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <span style={{ color: 'var(--text-muted)' }}>{title}</span>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-main)' }}>
              {navConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:scale-105"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-6 w-px" style={{ background: 'var(--border-color)' }}></div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</span>
                <span className="text-xs leading-tight capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role || role}</span>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); logout(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors hover:scale-105"
                style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
