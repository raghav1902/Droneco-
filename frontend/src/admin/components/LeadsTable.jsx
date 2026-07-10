import React from 'react';

const LeadsTable = ({
  leads,
  loadingLeads,
  getCourseName,
  handleOpenLead,
  totalPages,
  currentPage,
  setCurrentPage
}) => {
  return (
    <>
      <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
        {loadingLeads ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leads found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Student Name</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Course</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Mobile</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Submitted At</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{lead.full_name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{getCourseName(lead.interested_course_id)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{lead.mobile_number}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge badge-${lead.status.toLowerCase().replace(' ', '-')}`}>{lead.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(lead.submitted_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleOpenLead(lead)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && !loadingLeads && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            className="btn btn-secondary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn btn-secondary" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default LeadsTable;
