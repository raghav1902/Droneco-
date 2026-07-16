import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Clock, TrendingUp } from 'lucide-react';
import API from '../../api/api';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid var(--${colorClass})` }}>
    <div style={{ padding: '1rem', borderRadius: '50%', background: `var(--${colorClass}-glow)`, color: `var(--${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>{value}</h3>
    </div>
  </div>
);

const FeeDashboard = ({ setActiveTab }) => {
  const [data, setData] = useState({
    summary: { totalCollected: 0, totalPending: 0, todaysCollection: 0, totalStudents: 0 },
    recentTransactions: [],
    revenueTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/admin/reports');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching fee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = ['TXN ID', 'Student', 'Amount', 'Method', 'Status'];
      const rows = data.recentTransactions.map(txn => 
        [txn.id, txn.studentName, txn.amount, txn.method, txn.status].join(',')
      );
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Fee_Dashboard_Transactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Export successful', 'success');
    } catch (error) {
      showToast('Error exporting data', 'error');
    }
  };

  return (
    <div className="animate-fade-in dashboard-print-container">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .dashboard-print-container { width: 100%; margin: 0; padding: 0; }
            body { background: white; }
          }
        `}
      </style>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Fee Overview</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); handleExportCSV(); }}>Generate CSV</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Total Fees Collected" value={`₹${data.summary.totalCollected.toLocaleString()}`} icon={DollarSign} colorClass="success" />
        <StatCard title="Pending Fees" value={`₹${data.summary.totalPending.toLocaleString()}`} icon={Clock} colorClass="warning" />
        <StatCard title="Today's Collection" value={`₹${data.summary.todaysCollection.toLocaleString()}`} icon={TrendingUp} colorClass="accent" />
        <StatCard title="Total Students" value={data.summary.totalStudents} icon={Users} colorClass="text-secondary" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Revenue Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend />
                <Bar dataKey="collected" fill="var(--success)" name="Collected" />
                <Bar dataKey="pending" fill="var(--warning)" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card overflow-hidden !p-0 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>TXN ID</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Method</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {data.recentTransactions.map(txn => (
                  <tr key={txn.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-4 px-6 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{txn.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
                             style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                          {(txn.studentName || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{txn.studentName}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-sm" style={{ color: 'var(--text-main)' }}>₹{txn.amount?.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {txn.method}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge badge-${txn.status.toLowerCase()}`}>{txn.status}</span>
                    </td>
                  </tr>
                ))}
                {data.recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <button className="btn btn-secondary text-sm px-6 py-2" onClick={() => setActiveTab('payment-history')}>View All Transactions</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;
