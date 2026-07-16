import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CreditCard, Bell, User } from 'lucide-react';
import { showToast } from '../../utils/toast.js';
import API from '../../api/api.js';

const DueList = ({ onCollectFee }) => {
  const [search, setSearch] = useState('');
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await API.get('/fees/dues');
        setDues(res.data.data);
      } catch (err) {
        console.error('Failed to fetch due list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  const filteredDues = dues.filter(fee => {
    const name = fee.lead_id?.full_name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleCollectFee = (fee) => {
    if (onCollectFee) {
      const student = {
        id: fee.lead_id?._id || fee.lead_id?.id,
        name: fee.lead_id?.full_name,
        full_name: fee.lead_id?.full_name,
        mobile_number: fee.lead_id?.mobile_number,
        email: fee.lead_id?.email,
      };
      onCollectFee(student);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Due List</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Students with pending fee payments.</p>
        </div>
        {filteredDues.length > 0 && (
          <div className="px-4 py-2 rounded-lg font-bold text-sm shadow-sm" style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)' }}>
            ₹{filteredDues.reduce((sum, f) => sum + (f.due_amount || 0), 0).toLocaleString()} Total Dues
          </div>
        )}
      </div>

      <div className="glass-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select font-medium">
            <option value="All">All Classes</option>
          </select>
          <select className="form-select font-medium">
            <option value="All">All Statuses</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student ID</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Course</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Paid</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Due Amount</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredDues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                      <CheckCircle size={32} />
                    </div>
                    <div className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>All Clear!</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>No pending dues — all fees are up to date.</div>
                  </td>
                </tr>
              ) : filteredDues.map((fee) => (
                <tr key={fee.id || fee._id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {(fee.lead_id?._id || '').substring(0, 8)}…
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                           style={{ background: 'var(--danger-glow)', color: 'var(--danger)' }}>
                        {getInitials(fee.lead_id?.full_name)}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                          {fee.lead_id?.full_name || 'Unknown'}
                          <AlertCircle size={14} style={{ color: 'var(--danger)' }} />
                        </div>
                        {fee.lead_id?.mobile_number && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{fee.lead_id.mobile_number}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {fee.course_id?.course_name || 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-bold" style={{ color: 'var(--success)' }}>
                    ₹{(fee.paid_amount || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold" style={{ color: 'var(--danger)' }}>
                    ₹{fee.due_amount?.toLocaleString()}
                    <div className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      of ₹{fee.net_payable?.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                        onClick={() => showToast(`Reminder noted for ${fee.lead_id?.full_name}`, 'info')}
                        title="Send Reminder"
                      >
                        <Bell size={14} />
                      </button>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                        style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-hex)', color: 'var(--accent-hex)' }}
                        onClick={() => handleCollectFee(fee)}
                        title="Collect Fee"
                      >
                        <CreditCard size={14} />
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

export default DueList;
