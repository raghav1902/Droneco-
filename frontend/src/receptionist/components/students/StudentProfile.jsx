import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, CreditCard, History, Clock, Bookmark, ArrowLeft } from 'lucide-react';

const StudentProfile = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Bookmark },
    { id: 'fees', label: 'Fee Details', icon: CreditCard },
    { id: 'history', label: 'Payment History', icon: History },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'remarks', label: 'Remarks', icon: FileText }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none', background: 'var(--bg-tertiary)' }} onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.015em' }}>Student Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Profile Card & Tabs Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          
          {/* Left: Profile Summary Card */}
          <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 600, margin: '0 auto 1rem' }}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{student.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{student.id}</p>
              <span className={`status-badge ${student.status === 'Active' ? 'status-success' : 'status-error'}`}>
                {student.status}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>{student.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>student@example.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>New Delhi, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>Joined: 15 Jan 2026</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Course Enrolled</div>
              <div style={{ fontWeight: 500 }}>{student.course}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.batch} Batch</div>
            </div>
          </div>

          {/* Right: Tabs & Content */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', background: 'var(--bg-tertiary)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  style={{
                    padding: '1rem 1.5rem',
                    background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                    border: 'none',
                    borderTop: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
                    borderRight: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div style={{ padding: '2.5rem', flex: 1, minHeight: '400px' }}>
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Student Overview</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Fee</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0' }}>₹45,000</div>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fee Paid</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0', color: 'var(--success)' }}>₹25,000</div>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Balance Due</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0', color: 'var(--error)' }}>₹20,000</div>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '2.5rem 0 1.5rem' }}>Recent Activity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ padding: '0.5rem', background: 'var(--success-glow)', color: 'var(--success)', borderRadius: '50%', height: 'fit-content' }}><CreditCard size={16} /></div>
                      <div>
                        <div style={{ fontWeight: 500 }}>Fee Paid: ₹5,000</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Via UPI on 01 Jul 2026</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ padding: '0.5rem', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', height: 'fit-content' }}><User size={16} /></div>
                      <div>
                        <div style={{ fontWeight: 500 }}>Admission Completed</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned to Morning Batch on 15 Jan 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab !== 'overview' && (
                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
                  <FileText size={48} style={{ opacity: 0.2 }} />
                  <p>Detailed {activeTab} information will appear here.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
