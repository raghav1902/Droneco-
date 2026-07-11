import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import API from '../../api/api.js';
import { collectFeeSchema, validateForm } from '../../utils/validators.js';
import { showToast } from '../../utils/toast.js';

const CollectFee = ({ student, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('UPI');
  const [discount, setDiscount] = useState(0);
  const [lateFee, setLateFee] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [feeData, setFeeData] = useState(null);
  const [loadingFee, setLoadingFee] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  
  const [discountRules, setDiscountRules] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await API.get('/discounts');
        if (res.data.success) {
          setDiscountRules(res.data.data.filter(d => d.is_active));
        }
      } catch (err) {
        console.error('Failed to fetch discounts:', err);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    if (student && student.id) {
      const fetchFee = async () => {
        try {
          const res = await API.get(`/fees/student/${student.id}`);
          if (res.data.data && res.data.data.length > 0) {
            setFeeData(res.data.data[0]);
            setAmount(res.data.data[0].due_amount);
          }
        } catch (err) {
          console.error("Error fetching fee details:", err);
        } finally {
          setLoadingFee(false);
        }
      };
      fetchFee();
    }
  }, [student]);

  if (!student) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Please search and select a student first.</p>
      </div>
    );
  }

  if (loadingFee) {
    return <div className="p-8 text-center"><span className="spinner w-8 h-8 border-4 border-primary"></span></div>;
  }

  if (!feeData) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No fee structure assigned to this student. Please assign one via the Admission Wizard.</p>
      </div>
    );
  }

  const selectedDiscountRule = discountRules.find(d => d.id === selectedDiscountId || d._id === selectedDiscountId);
  let computedDiscount = 0;
  if (selectedDiscountRule) {
    if (selectedDiscountRule.type === 'Percentage') {
      computedDiscount = (feeData.due_amount * selectedDiscountRule.value) / 100;
    } else {
      computedDiscount = selectedDiscountRule.value;
    }
  }

  const totalToPay = (Number(amount) || 0) + (Number(lateFee) || 0) - (Number(computedDiscount) || 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const validation = validateForm(collectFeeSchema, {
      amount_paid: Number(amount),
      payment_method: method,
      remarks: remarks
    });
    if (!validation.success) {
      setIsProcessing(false);
      const msgs = Object.values(validation.errors).join(', ');
      return showToast(msgs, 'error');
    }

    try {
      const response = await API.post('/payments', {
        fee_id: feeData.id,
        amount_paid: amount,
        payment_method: method,
        late_fee: lateFee,
        discount_applied: computedDiscount,
        remarks: remarks
      });
      setReceiptData(response.data.data);
      setShowSuccess(true);
    } catch (err) {
      console.error('Payment Error', err);
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--success-glow)', color: 'var(--success)', marginBottom: '1.5rem' }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Payment Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Receipt {receiptData?.receipt_number} generated successfully.</p>
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
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Processing payment for {student.name || student.full_name}</p>
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
                <label className="form-label">Discount Rule</label>
                <select
                  className="form-select"
                  value={selectedDiscountId}
                  onChange={(e) => setSelectedDiscountId(e.target.value)}
                >
                  <option value="">No Discount</option>
                  {discountRules.map(rule => (
                    <option key={rule.id || rule._id} value={rule.id || rule._id}>
                      {rule.name} ({rule.type === 'Percentage' ? `${rule.value}%` : `₹${rule.value}`})
                    </option>
                  ))}
                </select>
                {computedDiscount > 0 && (
                  <p className="text-sm text-emerald-600 mt-1">-₹{computedDiscount.toLocaleString()} applied</p>
                )}
              </div>
            </div>

            {/* Payment Method & Remarks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div>
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-input"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>
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
