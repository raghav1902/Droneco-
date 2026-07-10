import React from 'react';

const AnalyticsDashboard = ({ stats, loadingStats }) => {
  if (loadingStats) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!stats) return <p>No statistics available.</p>;

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total Inquiries</span>
          <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.totalLeads}</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Conversions (Enrolled)</span>
          <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.enrolledLeads}</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Conversion Rate</span>
          <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.conversionRate}%</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-hex)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Active Follow-ups</span>
          <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.pendingFollowUps}</h3>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Leads by Status */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Inquiries by Pipeline Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stats.leadsByStatus.map((item, index) => {
              const percent = stats.summary.totalLeads > 0 ? (item.value / stats.summary.totalLeads) * 100 : 0;
              return (
                <div key={item.name} style={{
                  padding: '1.25rem 0',
                  borderBottom: index !== stats.leadsByStatus.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--text-main)' }}>{item.value}</span> ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: item.name === 'Enrolled' ? 'var(--success)' : item.name === 'New' ? 'var(--text-muted)' : 'var(--text-muted)',
                      borderRadius: '2px',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Course */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Inquiries by Course Choice</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stats.leadsByCourse.map((item, index) => {
              const percent = stats.summary.totalLeads > 0 ? (item.value / stats.summary.totalLeads) * 100 : 0;
              return (
                <div key={item.name} style={{
                  padding: '1.25rem 0',
                  borderBottom: index !== stats.leadsByCourse.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--text-main)' }}>{item.value}</span> ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'var(--accent-hex)',
                      borderRadius: '2px',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
