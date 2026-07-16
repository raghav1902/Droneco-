import React from 'react';
import { Eye, Edit, UserPlus, CheckCircle, Search, Filter, Users, Calendar, MapPin, BookOpen } from 'lucide-react';

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
    <div className="animate-fade-in space-y-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
            <div className="p-2 rounded-lg" style={{ background: 'var(--accent-glow)', color: 'var(--accent-hex)' }}>
              <Users size={28} />
            </div>
            Student Inquiries
          </h1>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Manage and track all incoming student leads and applications.
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="glass-card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-main)' }}>
          <Filter size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Filter Inquiries</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select className="form-select font-medium" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Approved">Approved</option>
            <option value="Enrolled">Enrolled</option>
          </select>
          
          <select className="form-select font-medium" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="All">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
          </select>
          
          <select className="form-select font-medium" value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)}>
            <option value="All">All Assignments</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card overflow-hidden !p-0">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>No inquiries found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Course Interest</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>City</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Assigned To</th>
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
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{lead.full_name}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{lead.email || lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="opacity-50" />
                        {new Date(lead.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        <MapPin size={14} className="opacity-50" />
                        {lead.city || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getBadgeClass(lead.status)}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {lead.assigned_to_name || <span className="italic opacity-60">Unassigned</span>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm" 
                          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} 
                          onClick={() => onViewLead(lead)} 
                          title="View/Edit"
                        >
                          <Eye size={16} />
                        </button>
                        {lead.status === 'Approved' && (
                          <button 
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                            style={{ background: 'var(--success-glow)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}
                            onClick={() => onEnrollLead(lead)} 
                            title="Enroll Student"
                          >
                            <UserPlus size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLeads;
