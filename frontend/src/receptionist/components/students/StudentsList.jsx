import React, { useState } from 'react';
import { Eye, Edit, CreditCard, Printer, MoreVertical, Search, Filter, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { showToast } from '../../../utils/toast.js';

import API from '../../../api/api.js';
import StudentIdCard from './StudentIdCard';

const StudentsList = ({ onViewProfile, onCollectFee, onEnrollNew, onEditStudent }) => {
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printStudent, setPrintStudent] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, feesRes] = await Promise.all([
          API.get('/v2/students'),
          API.get('/fees')
        ]);
        
        const fees = feesRes.data?.data || [];
        
        const mappedStudents = studentsRes.data.data.map(s => {
          // Find the fee structure for this student
          const studentFee = fees.find(f => (f.student_id && (f.student_id._id === s._id || f.student_id === s._id)));
          let feeStatus = 'N/A';
          if (studentFee) {
            if (studentFee.due_amount <= 0) feeStatus = 'Paid';
            else if (studentFee.due_amount > 0 && studentFee.paid_amount > 0) feeStatus = 'Pending';
            else feeStatus = 'Pending'; // Or 'Overdue' if you have logic for it
          }

          return {
            ...s,
            id: s._id,
            full_name: `${s.personal_info?.first_name || ''} ${s.personal_info?.last_name || ''}`.trim(),
            email: s.contact_info?.email || 'N/A',
            mobile_number: s.contact_info?.mobile_number || 'N/A',
            interested_course_id: { course_name: s.department_id?.name || 'N/A' },
            status: s.status === 'ACTIVE' ? 'Enrolled' : s.status,
            fee_status: feeStatus
          };
        });
        setStudents(mappedStudents);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMenu = (id) => {
    if (activeMenu === id) setActiveMenu(null);
    else setActiveMenu(id);
  };

  const getFeeBadge = (status) => {
    switch (status) {
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
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-muted-foreground">Loading students...</td>
              </tr>
            ) : students.map((student) => (
              <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                <td className="py-4 px-6">
                  <span className="font-semibold text-primary">{student.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                      {student.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{student.full_name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                      <div className="text-xs text-muted-foreground">{student.mobile_number}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-foreground">{student.interested_course_id?.course_name || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">N/A Batch</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {getFeeBadge(student.fee_status)}
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
                        <div className="h-px bg-border my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => { onCollectFee(student); setActiveMenu(null); }}>
                          <CreditCard className="w-4 h-4 text-primary" /> Collect Fee
                        </button>
                        <div className="h-px bg-border my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => {
                          setActiveMenu(null);
                          setPrintStudent(student);
                        }}>
                          <Printer className="w-4 h-4 text-muted-foreground" /> Print ID Card
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2" onClick={() => { showToast('Please go to Payment History to view and print specific receipts.', 'info'); setActiveMenu(null); }}>
                          <Printer className="w-4 h-4 text-muted-foreground" /> Print Receipt
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {(!loading && students.length === 0) && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-muted-foreground">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {printStudent && (
        <StudentIdCard student={printStudent} onClose={() => setPrintStudent(null)} />
      )}
    </div>
  );
};

export default StudentsList;
