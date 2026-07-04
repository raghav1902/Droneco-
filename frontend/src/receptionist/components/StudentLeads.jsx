import React from 'react';
import { Eye, Edit, UserPlus, CheckCircle } from 'lucide-react';

const StudentLeads = ({
  leads,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  courseFilter,
  setCourseFilter,
  assignmentFilter,
  setAssignmentFilter,
  courses,
  onViewLead,
  onEnrollLead
}) => {
  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : 'N/A';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.015em' }}>Student Inquiries</h1>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Approved">Approved</option>
              <option value="Enrolled">Enrolled</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select className="form-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="All">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select className="form-select" value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)}>
              <option value="All">All Leads</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No student inquiries found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student Name</th>
                <th>Course Interest</th>
                <th>City</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="table-row-hover">
                  <td>{new Date(lead.created_at || new Date()).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lead.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ }</div>
                  </td>
                  <td>{getCourseName(lead.course_id)}</td>
                  <td>{lead.city || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${lead.status === 'Enrolled' ? 'status-success' :
                        lead.status === 'Approved' ? 'status-success' :
                          lead.status === 'Interested' ? 'status-info' :
                            lead.status === 'Not Interested' ? 'status-error' :
                              'status-warning'
                      }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.assigned_to_name || 'Unassigned'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'var(--bg-tertiary)' }} onClick={() => onViewLead(lead)} title="View/Edit">
                        <Eye size={16} />
                      </button>
                      {lead.status === 'Approved' && (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }} onClick={() => onEnrollLead(lead)} title="Enroll Student">
                          <UserPlus size={16} /> Enroll
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentLeads;
