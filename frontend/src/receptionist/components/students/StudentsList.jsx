import React, { useState } from 'react';
import { Eye, Edit, CreditCard, Printer, MoreVertical, Search, Filter, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { showToast } from '../../../utils/toast.js';

const mockStudents = [
  { id: 'DRN2026001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210', course: 'Full Stack Web Development', batch: 'Morning', status: 'Active', feeStatus: 'Paid' },
  { id: 'DRN2026002', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 9876543211', course: 'Data Science with Python', batch: 'Evening', status: 'Active', feeStatus: 'Pending' },
  { id: 'DRN2026003', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 9876543212', course: 'Digital Marketing', batch: 'Weekend', status: 'Inactive', feeStatus: 'Overdue' }
];

const StudentsList = ({ onViewProfile, onCollectFee, onEnrollNew }) => {
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    if (activeMenu === id) setActiveMenu(null);
    else setActiveMenu(id);
  };

  const getFeeBadge = (status) => {
    switch(status) {
      case 'Paid': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'Pending': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Overdue': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><AlertCircle className="w-3 h-3" /> Overdue</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Students Directory</h1>
          <p className="text-muted-foreground mt-1">Manage enrolled students, profiles, and fee collection.</p>
        </div>
        <button className="btn btn-primary shadow-sm gap-2" onClick={onEnrollNew}>
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            className="form-input pl-10 bg-background"
            placeholder="Search by ID, Name, Phone or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="form-select w-40 bg-background">
            <option value="All">All Courses</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Data Science">Data Science</option>
          </select>
          <select className="form-select w-40 bg-background">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="btn btn-secondary bg-background gap-2 border-border" onClick={() => showToast('Filters applied', 'success')}>
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student ID</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student Info</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course & Batch</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fee Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockStudents.map((student) => (
              <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                <td className="py-4 px-6">
                  <span className="font-semibold text-primary">{student.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                      <div className="text-xs text-muted-foreground">{student.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-foreground">{student.course}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{student.batch} Batch</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${student.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {getFeeBadge(student.feeStatus)}
                </td>
                <td className="py-4 px-6 text-right relative">
                  <button 
                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => toggleMenu(student.id)}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenu === student.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                      <div className="absolute right-8 top-12 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50 animate-fade-in">
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => { onViewProfile(student); setActiveMenu(null); }}>
                          <Eye className="w-4 h-4 text-muted-foreground" /> View Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => { showToast('Edit feature coming soon!', 'info'); setActiveMenu(null); }}>
                          <Edit className="w-4 h-4 text-muted-foreground" /> Edit Info
                        </button>
                        <div className="h-px bg-border my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => { onCollectFee(student); setActiveMenu(null); }}>
                          <CreditCard className="w-4 h-4 text-primary" /> Collect Fee
                        </button>
                        <div className="h-px bg-border my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => setActiveMenu(null)}>
                          <Printer className="w-4 h-4 text-muted-foreground" /> Print ID Card
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => setActiveMenu(null)}>
                          <Printer className="w-4 h-4 text-muted-foreground" /> Print Receipt
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {mockStudents.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-muted-foreground">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;
