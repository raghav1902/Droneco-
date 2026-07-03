import React, { useState } from 'react';
import { Search, User, Phone, BookOpen, CreditCard } from 'lucide-react';

const StudentSearch = ({ onCollectFee }) => {
  const [search, setSearch] = useState('');
  const [student, setStudent] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // No database connection yet, search returns empty for now.
    setStudent(null);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Student Search</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Search by Name, ID, or Phone Number</p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter student name, ID, or phone..." 
              style={{ paddingLeft: '3rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>Search</button>
        </form>
      </div>

      {student && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Profile Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <User size={40} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{student.name}</h3>
                  <span className="badge badge-secondary" style={{ marginTop: '0.25rem' }}>{student.id}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Phone size={18} /> <span>{student.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <BookOpen size={18} /> <span>{student.course}</span>
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            <div style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} /> Fee Summary
              </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Fee:</span>
                <span style={{ fontWeight: 600 }}>₹{student.totalFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Paid Fee:</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹{student.paidFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Remaining Fee:</span>
                <span style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1.25rem' }}>₹{student.remainingFee}</span>
              </div>
              
              {student.remainingFee > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '1rem' }}>Next due date: {student.nextDueDate}</p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onCollectFee(student)}>
                    Collect Payment
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
