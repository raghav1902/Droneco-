import React, { useState } from 'react';
import { Eye, Edit, CreditCard, Printer, MoreVertical, Search, Filter } from 'lucide-react';
import { showToast } from '../../../utils/toast.js';


const mockStudents = [
  { id: 'DRN2026001', name: 'Rahul Sharma', phone: '+91 9876543210', course: 'Full Stack Web Development', batch: 'Morning', status: 'Active', feeStatus: 'Paid' },
  { id: 'DRN2026002', name: 'Priya Patel', phone: '+91 9876543211', course: 'Data Science with Python', batch: 'Evening', status: 'Active', feeStatus: 'Pending' },
  { id: 'DRN2026003', name: 'Amit Kumar', phone: '+91 9876543212', course: 'Digital Marketing', batch: 'Weekend', status: 'Inactive', feeStatus: 'Overdue' }
];

const StudentsList = ({ onViewProfile, onCollectFee }) => {
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    if (activeMenu === id) setActiveMenu(null);
    else setActiveMenu(id);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.015em' }}>Enrolled Students</h1>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ID, Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="table-container" style={{ overflow: 'visible' }}>
        <table style={{ minHeight: '300px' }}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name & Contact</th>
              <th>Course & Batch</th>
              <th>Status</th>
              <th>Fee Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map(student => (
              <tr key={student.id} className="table-row-hover">
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.phone}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{student.course}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.batch} Batch</div>
                </td>
                <td>
                  <span className={`status-badge ${student.status === 'Active' ? 'status-success' : 'status-error'}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${student.feeStatus === 'Paid' ? 'status-success' : student.feeStatus === 'Pending' ? 'status-warning' : 'status-error'}`}>
                    {student.feeStatus}
                  </span>
                </td>
                <td style={{ textAlign: 'right', position: 'relative' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} onClick={() => toggleMenu(student.id)}>
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenu === student.id && (
                    <div style={{
                      position: 'absolute', right: '1rem', top: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)', padding: '0.5rem',
                      display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 10, minWidth: '180px', textAlign: 'left'
                    }}>
                      <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'transparent' }} onClick={() => { onViewProfile(student); setActiveMenu(null); }}>
                        <Eye size={16} /> View Profile
                      </button>
                      <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'transparent' }} onClick={() => setActiveMenu(null)}>
                        <Edit size={16} /> Edit Info
                      </button>
                      <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'transparent' }} onClick={() => { onCollectFee(student); setActiveMenu(null); }}>
                        <CreditCard size={16} /> Collect Fee
                      </button>
                      <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'transparent' }} onClick={() => setActiveMenu(null)}>
                        <Printer size={16} /> Print ID Card
                      </button>
                      <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'transparent' }} onClick={() => setActiveMenu(null)}>
                        <Printer size={16} /> Print Receipt
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;
