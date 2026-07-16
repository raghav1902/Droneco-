import React from 'react';
import { Eye, Users, Calendar, BookOpen, Smartphone } from 'lucide-react';

const LeadsTable = ({
  leads,
  loadingLeads,
  getCourseName,
  handleOpenLead,
  totalPages,
  currentPage,
  setCurrentPage
}) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'Contacted': return 'badge-contacted';
      case 'Interested': return 'badge-interested';
      case 'Not Interested': return 'badge-not-interested';
      case 'Approved':
      case 'Enrolled': return 'badge-enrolled';
      default: return 'badge-new';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="glass-card overflow-hidden !p-0">
        {loadingLeads ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>No leads found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student Name</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Course</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mobile</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Submitted At</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {leads.map(lead => (
                  <tr key={lead.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                             style={{ background: 'var(--accent-glow)', color: 'var(--accent-hex)' }}>
                          {getInitials(lead.full_name)}
                        </div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{lead.full_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="opacity-50" />
                        {getCourseName(lead.interested_course_id)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1.5">
                        <Smartphone size={14} className="opacity-50" />
                        {lead.mobile_number}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getBadgeClass(lead.status)}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="opacity-50" />
                        {new Date(lead.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm" 
                          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} 
                          onClick={() => handleOpenLead(lead)} 
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && !loadingLeads && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            className="btn btn-secondary text-sm px-4 py-2" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn btn-secondary text-sm px-4 py-2" 
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
