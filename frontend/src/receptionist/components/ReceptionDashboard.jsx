import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Users, ArrowUpRight, Loader } from 'lucide-react';
import API from '../../api/api.js';

const StatCard = ({ title, value, icon: Icon, colorClass, loading }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid var(--${colorClass})`, padding: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '50%', background: `var(--${colorClass}-glow)`, color: `var(--${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{title}</p>
      {loading ? <Loader className="animate-spin mt-1" size={20} color="var(--text-muted)" /> : (
        <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>{value}</h3>
      )}
    </div>
  </div>
);

const ReceptionDashboard = () => {
  const [todaysCollection, setTodaysCollection] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [studentsVisited, setStudentsVisited] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch Payments
        const paymentsRes = await API.get('/payments');
        if (paymentsRes.data?.success) {
          const payments = paymentsRes.data.data;
          let collectionToday = 0;
          const recentList = [];

          payments.forEach(p => {
            const pDate = new Date(p.transaction_date);
            if (pDate >= today) {
              const amount = (p.amount_paid || 0) + (p.late_fee || 0);
              collectionToday += amount;
              recentList.push({
                rcpt: p.receipt_number,
                student: p.fee_id?.lead_id?.full_name || 'Unknown',
                amount: amount,
                time: pDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                method: p.payment_method,
                dateObj: pDate
              });
            }
          });

          // Sort recent payments descending by time
          recentList.sort((a, b) => b.dateObj - a.dateObj);
          
          setTodaysCollection(collectionToday);
          setRecentPayments(recentList.slice(0, 10)); // Top 10 today
        }

        // Fetch Fees
        const feesRes = await API.get('/fees');
        if (feesRes.data?.success) {
          const fees = feesRes.data.data;
          let pendingTotal = 0;
          fees.forEach(f => {
            if (f.student_id || (f.lead_id && f.lead_id.status === 'Enrolled')) {
              pendingTotal += (f.due_amount || 0);
            }
          });
          setPendingFees(pendingTotal);
        }

        // Fetch Leads for "Students Visited" (Leads created today)
        const leadsRes = await API.get('/leads');
        if (leadsRes.data?.success) {
          const leads = leadsRes.data.data;
          let visitedToday = 0;
          leads.forEach(l => {
            const lDate = new Date(l.submitted_at || l.createdAt);
            if (lDate >= today) {
              visitedToday++;
            }
          });
          setStudentsVisited(visitedToday);
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Daily Operations Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Here's what is happening today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard loading={loading} title="Today's Collection" value={`₹${todaysCollection.toLocaleString()}`} icon={DollarSign} colorClass="success" />
        <StatCard loading={loading} title="Pending Fees (Overall)" value={`₹${pendingFees.toLocaleString()}`} icon={Clock} colorClass="warning" />
        <StatCard loading={loading} title="Students Visited" value={studentsVisited} icon={Users} colorClass="accent" />
        <StatCard loading={loading} title="Recent Payments" value={recentPayments.length} icon={ArrowUpRight} colorClass="text-secondary" />
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Recent Payments (Today)</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Receipt No.</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Amount</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Time</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                 <tr>
                    <td colSpan="5" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                        <Loader className="animate-spin inline-block" size={24} />
                    </td>
                 </tr>
              ) : recentPayments.length > 0 ? recentPayments.map(txn => (
                <tr key={txn.rcpt} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>{txn.rcpt}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
                           style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                        {(txn.student || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{txn.student}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold" style={{ color: 'var(--success)' }}>+₹{txn.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-muted)' }}>{txn.time}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {txn.method}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>No recent payments today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
