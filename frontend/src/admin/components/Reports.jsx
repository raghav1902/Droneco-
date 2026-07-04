import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { showToast } from '../../utils/toast.js';


const mockDailyCollection = [
  { name: '1 Oct', amount: 0 },
  { name: '2 Oct', amount: 0 },
  { name: '3 Oct', amount: 0 },
  { name: '4 Oct', amount: 0 },
  { name: '5 Oct', amount: 0 },
  { name: '6 Oct', amount: 0 },
  { name: '7 Oct', amount: 0 },
];

const mockPaymentMethods = [
  { name: 'UPI', value: 0 },
  { name: 'Card', value: 0 },
  { name: 'Cash', value: 0 },
  { name: 'Bank Transfer', value: 0 },
];
const COLORS = ['#e0a458', '#4ade80', '#3b82f6', '#f87171'];

const Reports = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Daily Collection Area Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Daily Collection Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDailyCollection}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-hex)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-hex)" stopOpacity={0}/>
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
                  data={mockPaymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockPaymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }} 
                  itemStyle={{ color: 'var(--text-main)' }} 
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Student-wise Pending Fees (Top 5)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Course</th>
              <th style={{ padding: '0.75rem 1rem' }}>Total Fee</th>
              <th style={{ padding: '0.75rem 1rem' }}>Paid</th>
              <th style={{ padding: '0.75rem 1rem' }}>Pending</th>
            </tr>
          </thead>
          <tbody>
            {[
            ].map((student, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{student.name}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{student.course}</td>
                <td style={{ padding: '0.75rem 1rem' }}>₹{student.total}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--success)' }}>₹{student.paid}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--danger)', fontWeight: 600 }}>₹{student.pending}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending fees data available.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
