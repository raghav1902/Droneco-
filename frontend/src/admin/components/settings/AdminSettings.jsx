import React, { useState } from 'react';
import { showToast } from '../../../utils/toast.js';

import { 
  Building2, Wallet, Receipt, Users, Shield, 
  Database, ScrollText, Info, Save, Upload, 
  Download, Plus, Edit2, Trash2, Key
} from 'lucide-react';

// --- Sub-components for each Settings Section ---

const InstituteSettings = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Institute Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Institute Name</label>
          <input type="text" className="form-input" defaultValue="Tech Academy" />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Logo Upload</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Logo</span>
            </div>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
              <Upload size={16} /> Choose Image
            </button>
          </div>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Address</label>
          <textarea className="form-textarea" rows="2" defaultValue="123 Education Lane, Tech District"></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Contact Number</label>
          <input type="text" className="form-input" defaultValue="+1 234-567-8900" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" defaultValue="contact@institute.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Website</label>
          <input type="url" className="form-input" defaultValue="https://institute.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Time Zone</label>
          <select className="form-select">
            <option>UTC (GMT+0)</option>
            <option>EST (GMT-5)</option>
            <option>IST (GMT+5:30)</option>
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Currency</label>
          <select className="form-select" style={{ maxWidth: '200px' }}>
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
        <Save size={16} /> Save Changes
      </button>
    </div>
  </div>
);

const FeeSettings = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Fee Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Default Due Date</label>
          <select className="form-select">
            <option>5th of every month</option>
            <option>10th of every month</option>
            <option>15th of every month</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Grace Period (Days)</label>
          <input type="number" className="form-input" defaultValue="5" />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Late Fee Rules</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" className="form-input" defaultValue="20" placeholder="Amount" style={{ width: '150px' }} />
            <select className="form-select" style={{ width: '150px' }}>
              <option>Per Day</option>
              <option>Per Week</option>
              <option>Per Month</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Allow Partial Payments</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="partial" defaultChecked /> On</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="partial" /> Off</label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Allow Installments</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="installments" defaultChecked /> On</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="installments" /> Off</label>
          </div>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tax Percentage (%)</label>
          <input type="number" className="form-input" defaultValue="0" style={{ maxWidth: '200px' }} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
        <Save size={16} /> Save Changes
      </button>
    </div>
  </div>
);

const ReceiptSettings = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Receipt Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Receipt Header</label>
          <textarea className="form-textarea" rows="2" defaultValue="Tech Academy Official Receipt"></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Footer Message</label>
          <textarea className="form-textarea" rows="2" defaultValue="Thank you for your payment. Fees once paid are non-refundable."></textarea>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Receipt Prefix</label>
            <input type="text" className="form-input" defaultValue="REC-2026-" />
          </div>
          <div className="form-group">
            <label className="form-label">Auto Receipt Numbering</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" defaultChecked /> On</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" /> Off</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Show Logo on Receipt</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="show_logo" defaultChecked /> Yes</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="show_logo" /> No</label>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
          <Save size={16} /> Save Changes
        </button>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
          Print Preview
        </button>
      </div>
    </div>
  </div>
);

const UserManagement = () => (
  <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem' }}>User Management</h3>
      <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
        <Plus size={16} /> Create User
      </button>
    </div>
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 1, name: 'Admin User', email: 'admin@institute.edu', role: 'Admin', status: 'Active' },
            { id: 2, name: 'Sarah Jenkins', email: 'sarah@institute.edu', role: 'Receptionist', status: 'Active' },
            { id: 3, name: 'Mike Ross', email: 'mike@institute.edu', role: 'Counselor', status: 'Inactive' },
          ].map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
              <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>{user.role}</span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{user.status}</span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} title="Reset Password" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Key size={14} /></button>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Edit2 size={14} /></button>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Security</h3>
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
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
    
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Access & Sessions</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Two-Factor Authentication (2FA)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Coming soon in a future update.</span>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Session Timeout (Minutes)</label>
          <input type="number" className="form-input" defaultValue="60" style={{ maxWidth: '200px' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Users will be automatically logged out after this period of inactivity.</p>
        </div>
        <div>
          <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>View Login History</button>
          <button className="btn btn-secondary" style={{ marginTop: '0.5rem', marginLeft: '1rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Manage Active Devices</button>
        </div>
      </div>
    </div>
  </div>
);

const BackupRestore = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Backup & Restore</h3>
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Download Backup</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Generate and download a complete backup of the database.</p>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
          <Download size={16} /> Download SQL Backup
        </button>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Restore Backup</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Upload a previous backup file to restore the database. <strong style={{ color: 'var(--danger)' }}>Warning: This will overwrite all current data.</strong></p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="file" className="form-input" style={{ maxWidth: '300px' }} />
          <button className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Upload size={16} /> Restore
          </button>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Export Data</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Export complete system reports (Students, Fees, Leads).</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Export to Excel (CSV)</button>
          <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Export to PDF</button>
        </div>
      </div>
    </div>
  </div>
);

const AuditLogs = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Audit Logs</h3>
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Timestamp</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Action</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Details</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 1, time: '2026-07-03 10:45 AM', user: 'Admin User', action: 'Login', details: 'Successful login', ip: '192.168.1.1' },
            { id: 2, time: '2026-07-03 11:12 AM', user: 'Admin User', action: 'Update Settings', details: 'Updated Fee Rules', ip: '192.168.1.1' },
            { id: 3, time: '2026-07-03 11:20 AM', user: 'Sarah Jenkins', action: 'Collect Fee', details: 'Collected ₹1500 from STU-089', ip: '192.168.1.4' },
          ].map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
              <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.time}</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>{log.user}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>{log.action}</span>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{log.details}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const About = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>About System</h3>
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
        <Building2 size={48} />
      </div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Institute Management System</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Version 1.0.0 (Build 20260703)</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', textAlign: 'left', background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Developer</span>
          <span style={{ fontWeight: 500 }}>Antigravity Tech</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Support Contact</span>
          <span style={{ fontWeight: 500 }}>support@antigravity.tech</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>License</span>
          <span style={{ fontWeight: 500 }}>Commercial - Single Institute</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main AdminSettings Wrapper ---

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('institute');

  const menuItems = [
    { id: 'institute', label: 'Institute Settings', icon: Building2 },
    { id: 'fee', label: 'Fee Settings', icon: Wallet },
    { id: 'receipt', label: 'Receipt Settings', icon: Receipt },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'institute': return <InstituteSettings />;
      case 'fee': return <FeeSettings />;
      case 'receipt': return <ReceiptSettings />;
      case 'users': return <UserManagement />;
      case 'security': return <SecuritySettings />;
      case 'backup': return <BackupRestore />;
      case 'audit': return <AuditLogs />;
      case 'about': return <About />;
      default: return <InstituteSettings />;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 100px)' }}>
      {/* Settings Navigation */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-card" style={{ padding: '1rem', position: 'sticky', top: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Settings Menu</h2>
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
  );
};

export default AdminSettings;
