import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { showToast } from '../../utils/toast.js';
import API from '../../api/api';

const COLORS = ['#e0a458', '#4ade80', '#3b82f6', '#f87171', '#a855f7'];

const Reports = () => {
  const [reportsData, setReportsData] = useState({
    dailyCollection: [],
    paymentMethods: [],
    pendingFees: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/admin/reports');
        setReportsData(res.data.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = ['Student Name', 'Course', 'Total Fee', 'Paid', 'Pending'];
      const rows = reportsData.pendingFees.map(student => 
        [student.name, student.course, student.total, student.paid, student.pending].join(',')
      );
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Pending_Fees_Report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Export successful', 'success');
    } catch (error) {
      showToast('Error exporting data', 'error');
    }
  };

  return (
    <div className="animate-fade-in reports-print-container">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .reports-print-container { width: 100%; margin: 0; padding: 0; }
            body { background: white; }
          }
        `}
      </style>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Analytics & Reports</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Detailed breakdown of fee collections and pending dues.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); handleExportCSV(); }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Daily Collection Area Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Daily Collection Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportsData.dailyCollection}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-hex)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--accent-hex)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--accent-hex)" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Payment Method Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportsData.paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reportsData.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Student-wise Pending Fees (Top 5)</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student Name</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Course</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Fee</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Paid</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {reportsData.pendingFees.map((student, idx) => (
                <tr key={idx} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
                           style={{ background: 'var(--warning-glow)', color: 'var(--warning)' }}>
                        {(student.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{student.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>{student.course}</td>
                  <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-main)' }}>₹{student.total?.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm font-bold" style={{ color: 'var(--success)' }}>₹{student.paid?.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm font-bold" style={{ color: 'var(--danger)' }}>₹{student.pending?.toLocaleString()}</td>
                </tr>
              ))}
              {reportsData.pendingFees.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>No pending fees data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
