import React, { useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { showToast } from '../../utils/toast.js';


const mockDues = [];

const DueList = () => {
  const [search, setSearch] = useState('');
  
  const filteredDues = mockDues.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) || 
    student.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Due List</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Students with pending fee payments.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by student name or ID..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select">
            <option value="All">All Classes</option>
            <option value="Batch A">Batch A</option>
            <option value="Batch B">Batch B</option>
            <option value="Batch C">Batch C</option>
          </select>
          <select className="form-select">
            <option value="All">All Statuses</option>
            <option value="Overdue">Overdue</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Student ID</th>
              <th style={{ padding: '1rem 1.5rem' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem' }}>Class / Course</th>
              <th style={{ padding: '1rem 1.5rem' }}>Due Date</th>
              <th style={{ padding: '1rem 1.5rem' }}>Due Amount</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDues.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{student.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                  {student.name}
                  {student.status === 'Overdue' && (
                    <AlertCircle size={14} style={{ display: 'inline', marginLeft: '0.5rem', color: 'var(--danger)' }} />
                  )}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.9rem' }}>{student.class}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.course}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: student.status === 'Overdue' ? 'var(--danger)' : 'var(--text-main)' }}>
                  {student.dueDate}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--warning)' }}>
                  ₹{student.dueAmount}
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Send Reminder</button>
                </td>
              </tr>
            ))}
            {filteredDues.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students with pending dues found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DueList;
