import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';

const initialDiscounts = [
  { id: 1, name: 'Merit Scholarship', type: 'Percentage', value: 20, active: true },
  { id: 2, name: 'Sibling Discount', type: 'Flat', value: 100, active: true },
  { id: 3, name: 'Staff Discount', type: 'Percentage', value: 50, active: true },
  { id: 4, name: 'Early Bird Special', type: 'Flat', value: 50, active: false },
];

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [showModal, setShowModal] = useState(false);

  const toggleStatus = (id) => {
    setDiscounts(discounts.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this discount?')) {
      setDiscounts(discounts.filter(d => d.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Discount Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Configure scholarships and promotional discounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Discount
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {discounts.map(discount => (
          <div key={discount.id} className="glass-card" style={{ padding: '1.5rem', opacity: discount.active ? 1 : 0.6, transition: 'var(--transition)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{discount.name}</h3>
                <span className={`badge badge-${discount.active ? 'success' : 'secondary'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                  {discount.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                {discount.type === 'Percentage' ? `${discount.value}%` : `₹${discount.value}`}
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                className="btn" 
                style={{ background: 'transparent', color: discount.active ? 'var(--warning)' : 'var(--success)', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
                onClick={() => toggleStatus(discount.id)}
              >
                <Power size={16} /> {discount.active ? 'Deactivate' : 'Activate'}
              </button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: 0 }} onClick={() => setShowModal(true)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: 0 }} onClick={() => handleDelete(discount.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Discount Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Discount Name</label>
                <input type="text" className="form-input" placeholder="e.g. Merit Scholarship" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-select">
                    <option>Percentage</option>
                    <option>Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Value</label>
                  <input type="number" className="form-input" placeholder="e.g. 20" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
