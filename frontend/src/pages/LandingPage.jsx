import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Sun, Moon, ArrowRight } from 'lucide-react';
import logo from '../assets/Droneco.jpg';

const LandingPage = () => {
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--bg-app)' }}>
      
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 pointer-events-none" 
           style={{ background: 'var(--accent-hex)', animation: 'float 8s ease-in-out infinite' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-15 pointer-events-none" 
           style={{ background: 'var(--primary)', animation: 'float 12s ease-in-out infinite reverse' }}></div>

      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 md:px-12 z-10">
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <img src={logo} alt="Droneco Logo" className="h-10 w-auto rounded shadow-sm" />
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Droneco</span>
        </a>
        
        <button
          onClick={handleToggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 z-10 w-full max-w-6xl mx-auto">
        
        <div className="text-center mb-16 animate-slide-up-fade">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            Welcome to <span style={{ color: 'var(--accent-hex)' }}>Droneco</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Empowering the next generation of innovators. Select your portal below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
          
          {/* Student Card */}
          <Link 
            to="/apply" 
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{ background: 'radial-gradient(circle at top right, var(--accent-glow) 0%, transparent 60%)' }}></div>
            
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                 style={{ background: 'var(--accent-light)', color: 'var(--accent-hex)' }}>
              <GraduationCap size={40} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>Student Registration</h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Apply for admission or submit an inquiry for our upcoming batches.</p>
            
            <div className="mt-auto flex items-center gap-2 font-semibold" style={{ color: 'var(--accent-hex)' }}>
              Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Staff Card */}
          <Link 
            to="/login" 
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{ background: 'radial-gradient(circle at top right, rgba(148, 163, 184, 0.1) 0%, transparent 60%)' }}></div>
            
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                 style={{ background: 'var(--bg-tertiary)', color: 'var(--text-main)' }}>
              <Briefcase size={40} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>Staff Portal</h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Secure login for Administrators, Counselors, and Institute Staff.</p>
            
            <div className="mt-auto flex items-center gap-2 font-semibold" style={{ color: 'var(--text-main)' }}>
              Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </main>

      <footer className="w-full p-6 text-center text-sm z-10" style={{ color: 'var(--text-muted)' }}>
        &copy; {new Date().getFullYear()} Droneco. All rights reserved.
      </footer>

      {/* Custom Keyframes for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
