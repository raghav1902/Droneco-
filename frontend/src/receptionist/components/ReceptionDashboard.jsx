import React from 'react';
import { DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid var(--${colorClass})`, padding: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '50%', background: `var(--${colorClass}-glow)`, color: `var(--${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>{value}</h3>
    </div>
  </div>
);

const ReceptionDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Daily Operations Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Here's what is happening today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Today's Collection" value="₹0" icon={DollarSign} colorClass="success" />
        <StatCard title="Pending Fees (Overall)" value="₹0" icon={Clock} colorClass="warning" />
        <StatCard title="Students Visited" value="0" icon={Users} colorClass="accent" />
        <StatCard title="Recent Payments" value="0" icon={ArrowUpRight} colorClass="text-secondary" />
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Payments (Today)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Receipt No.</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Time</th>
                <th style={{ padding: '0.75rem 1rem' }}>Method</th>
              </tr>
            </thead>
            <tbody>
              {[
              ].map(txn => (
                <tr key={txn.rcpt} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>{txn.rcpt}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{txn.student}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--success)' }}>+₹{txn.amount}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{txn.time}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                      {txn.method}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent payments.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
