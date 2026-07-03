import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const initialStructures = [];

const FeeStructure = () => {
  const [structures, setStructures] = useState(initialStructures);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const filteredStructures = structures.filter(s => s.course.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this fee structure?')) {
      setStructures(structures.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Fee Structure Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
          <Plus size={18} /> Add Fee Structure
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by course name..." 
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
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Course Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Total Fee</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Installments</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStructures.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>#{item.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{item.course}</td>
                <td style={{ padding: '1rem 1.5rem' }}>₹{item.totalFee.toLocaleString()}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${item.installmentsAllowed ? 'badge-success' : 'badge-danger'}`} style={{ 
                    background: item.installmentsAllowed ? 'var(--success-glow)' : 'var(--danger-glow)',
                    color: item.installmentsAllowed ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {item.installmentsAllowed ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-secondary'}`} style={{
                    background: item.status === 'Active' ? 'var(--success-glow)' : 'var(--bg-tertiary)',
                    color: item.status === 'Active' ? 'var(--success)' : 'var(--text-secondary)'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => { setEditingId(item.id); setShowModal(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }} onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStructures.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No fee structures found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Basic mockup */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editingId ? 'Edit Fee Structure' : 'Add Fee Structure'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Course Name</label>
                <input type="text" className="form-input" placeholder="e.g. Graphic Design" />
              </div>
              <div>
                <label className="form-label">Total Fee (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 1500" />
              </div>
              <div>
                <label className="form-label">Installments Allowed</label>
                <select className="form-select">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save Structure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;
