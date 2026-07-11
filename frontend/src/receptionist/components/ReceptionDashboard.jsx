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
            pendingTotal += (f.due_amount || 0);
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
              {loading ? (
                 <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader className="animate-spin inline-block" size={24} />
                    </td>
                 </tr>
              ) : recentPayments.length > 0 ? recentPayments.map(txn => (
                <tr key={txn.rcpt} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>{txn.rcpt}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{txn.student}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--success)' }}>+₹{txn.amount.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{txn.time}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                      {txn.method}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent payments.</td>
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
