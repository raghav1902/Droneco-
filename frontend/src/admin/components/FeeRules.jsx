import React, { useState } from 'react';
import { Calendar, AlertCircle, RefreshCw, Percent, Clock, X, Save } from 'lucide-react';

const RuleCard = ({ icon: Icon, title, description, value, onEdit }) => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent)' }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>{description}</p>
      </div>
    </div>
    
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{value}</div>
      <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={onEdit}>Edit Rule</button>
    </div>
  </div>
);

const FeeRules = () => {
  const [rules, setRules] = useState([
    { id: 'due_date', icon: Calendar, title: "Standard Due Date", description: "Default day of the month when installment fees are due.", value: "5th of Every Month" },
    { id: 'late_fee', icon: AlertCircle, title: "Late Fee Penalty", description: "Flat amount added to the student's due balance if payment passes the grace period.", value: "₹20 / month" },
    { id: 'installments', icon: RefreshCw, title: "Installment Options", description: "Maximum number of monthly installments a student can opt for.", value: "Up to 6 Months" },
    { id: 'tax', icon: Percent, title: "Tax Percentage", description: "Tax applied on the base fee. Leave 0 if tax is included in the total fee.", value: "0%" },
    { id: 'grace', icon: Clock, title: "Grace Period", description: "Number of days allowed after the due date before late fees trigger.", value: "3 Days" },
  ]);

  const [editingRule, setEditingRule] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEditClick = (rule) => {
    setEditingRule(rule);
    setEditValue(rule.value);
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    setRules(rules.map(r => r.id === editingRule.id ? { ...r, value: editValue } : r));
    setEditingRule(null);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Global Fee Rules</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Configure rules that apply across all fee structures and student payments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {rules.map(rule => (
          <RuleCard 
            key={rule.id}
            icon={rule.icon} 
            title={rule.title} 
            description={rule.description} 
            value={rule.value} 
            onEdit={() => handleEditClick(rule)} 
          />
        ))}
      </div>

      {editingRule && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content glass-card animate-fade-in" style={{ maxWidth: '400px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingRule(null)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Edit {editingRule.title}</h3>
            
            <form onSubmit={handleSaveRule}>
              <div className="form-group">
                <label className="form-label">Rule Value</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingRule(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeRules;
