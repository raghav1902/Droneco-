import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { showToast } from '../../utils/toast.js';


const mockHistory = [];

const PaymentHistory = () => {
  const [search, setSearch] = useState('');

  const filteredHistory = mockHistory.filter(txn => 
    txn.student.toLowerCase().includes(search.toLowerCase()) || 
    txn.rcpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Payment History</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search history..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Receipt No.</th>
              <th style={{ padding: '1rem 1.5rem' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem' }}>Student</th>
              <th style={{ padding: '1rem 1.5rem' }}>Amount</th>
              <th style={{ padding: '1rem 1.5rem' }}>Method</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((txn) => (
              <tr key={txn.rcpt} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{txn.rcpt}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{txn.date}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{txn.student}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--success)', fontWeight: 600 }}>+₹{txn.amount}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    {txn.method}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>View Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
