import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText, CheckCircle, Calendar, Hash } from 'lucide-react';
import { showToast } from '../../utils/toast.js';

import API from '../../api/api.js';

const PaymentHistory = ({ onViewReceipt }) => {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get('/payments');
        setHistory(res.data.data);
      } catch (err) {
        console.error('Failed to fetch payment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredHistory = history.filter(txn => {
    const studentName = txn.fee_id?.lead_id?.full_name || '';
    const receipt = txn.receipt_number || '';
    return studentName.toLowerCase().includes(search.toLowerCase()) ||
      receipt.toLowerCase().includes(search.toLowerCase());
  });

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Payment History</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>View and search all past fee transactions.</p>
        </div>
      </div>

      <div className="glass-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by student or receipt number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student Name</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Receipt No.</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Amount</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Method</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 text-slate-400">
                      <FileText size={32} />
                    </div>
                    <div className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>No transactions found</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria.</div>
                  </td>
                </tr>
              ) : filteredHistory.map((txn) => (
                <tr key={txn.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                           style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                        {getInitials(txn.fee_id?.lead_id?.full_name)}
                      </div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        {txn.fee_id?.lead_id?.full_name || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1.5">
                      <Hash size={14} className="opacity-50" />
                      {txn.receipt_number}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="opacity-50" />
                      {new Date(txn.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold" style={{ color: 'var(--success)' }}>
                    +₹{txn.amount_paid?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {txn.payment_method}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                        onClick={(e) => { e.preventDefault(); if (onViewReceipt) onViewReceipt(txn); }}
                        title="View Receipt"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
