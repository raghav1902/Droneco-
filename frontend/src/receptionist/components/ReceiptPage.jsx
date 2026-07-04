import React from 'react';
import { Download, Printer, Share2, CheckCircle } from 'lucide-react';
import { showToast } from '../../utils/toast.js';


const ReceiptPage = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Payment Receipt</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Share2 size={16} /> Share
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Download size={16} /> PDF
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '3rem', background: 'var(--bg-app)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--accent-hex)', fontWeight: 700, letterSpacing: '-1px' }}>INSTITUTE</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>123 Education Lane, Tech District<br/>contact@institute.edu | +1 234-567-8900</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
              <CheckCircle size={20} /> <span style={{ fontWeight: 600 }}>PAID</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Receipt #RCP-1045</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Billed To</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Alex Johnson</p>
            <p style={{ color: 'var(--text-secondary)' }}>ID: STU-2023-089</p>
            <p style={{ color: 'var(--text-secondary)' }}>Course: Full Stack Web Development</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment Info</h4>
            <p style={{ color: 'var(--text-main)' }}>Method: <span style={{ fontWeight: 600 }}>UPI</span></p>
            <p style={{ color: 'var(--text-main)' }}>Transaction ID: <span style={{ fontWeight: 600 }}>TXN-987654321</span></p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0' }}>Description</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0' }}>Course Fee Installment</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹0.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0' }}>Late Fee Penalty</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹0.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0' }}>Discount Applied</td>
              <td style={{ padding: '1rem 0', textAlign: 'right', color: 'var(--success)' }}>-₹0.00</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid var(--border)' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Remaining Balance: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹0.00</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Total Paid:</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-hex)' }}>₹0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
