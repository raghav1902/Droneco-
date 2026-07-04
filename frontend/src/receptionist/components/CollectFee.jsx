import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';

const CollectFee = ({ student, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(student ? student.remainingFee : 0);
  const [method, setMethod] = useState('UPI');
  const [discount, setDiscount] = useState(0);
  const [lateFee, setLateFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!student) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Please search and select a student first.</p>
      </div>
    );
  }

  const totalToPay = (Number(amount) || 0) + (Number(lateFee) || 0) - (Number(discount) || 0);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--success-glow)', color: 'var(--success)', marginBottom: '1.5rem' }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Payment Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Receipt #RCP-{Math.floor(Math.random() * 10000)} generated successfully.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => onPaymentSuccess(null)}>New Payment</button>
          <button className="btn btn-primary" onClick={() => onPaymentSuccess('receipt')}>View Receipt</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Collect Payment</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Processing payment for {student.name}</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handlePayment}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Amount */}
            <div>
              <label className="form-label">Payment Amount (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>

            {/* Adjustments */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Late Fee (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={lateFee}
                  onChange={(e) => setLateFee(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="form-label">Discount (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '0.5rem 0' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Total to Pay:</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-hex)' }}>
                ₹{Math.max(0, totalToPay).toFixed(2)}
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : (
                <>
                  <CreditCard size={20} /> Receive Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectFee;
