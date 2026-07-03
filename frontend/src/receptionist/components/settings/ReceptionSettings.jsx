import React, { useState } from 'react';
import { User, Shield, Save, Upload } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { showToast } from '../../../utils/toast.js';


const ProfileSettings = ({ user }) => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Profile Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '500px' }}>
        
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Image</span>
            </div>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
              <Upload size={16} /> Choose Image
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" defaultValue={user?.name || "Receptionist User"} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" defaultValue={user?.email || "reception@institute.edu"} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Contact admin to change email address.</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-input" defaultValue="+1 987-654-3210" />
        </div>
        
      </div>
      <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
        <Save size={16} /> Update Profile
      </button>
    </div>
  </div>
);

const AccountSettings = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Account Security</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Change Password</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px' }}>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input type="password" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input type="password" className="form-input" />
        </div>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Update Password</button>
      </div>
    </div>
  </div>
);

const ReceptionSettings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'account', label: 'Account Settings', icon: Shield },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings user={user} />;
      case 'account': return <AccountSettings />;
      default: return <ProfileSettings user={user} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 100px)' }}>
        {/* Settings Navigation */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div className="glass-card" style={{ padding: '1rem', position: 'sticky', top: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {menuItems.map(item => (
                <button 
                  key={item.id}
                  className={`btn ${activeSection === item.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ 
                    justifyContent: 'flex-start', 
                    padding: '0.75rem 1rem', 
                    borderColor: 'transparent',
                    background: activeSection === item.id ? 'var(--accent)' : 'transparent',
                    color: activeSection === item.id ? '#fff' : 'var(--text-main)',
                    boxShadow: 'none'
                  }}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon size={18} style={{ marginRight: '0.5rem' }} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content area */}
        <div style={{ flex: 1, paddingBottom: '2rem' }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default ReceptionSettings;
