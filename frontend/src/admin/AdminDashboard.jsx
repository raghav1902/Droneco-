import React, { useState, useEffect } from 'react';
import { Save, X, Edit, Power, BookOpen, HelpCircle } from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layouts/AppLayout';
import FeeDashboard from './components/FeeDashboard';
import Reports from './components/Reports';
import AdminSettings from './components/settings/AdminSettings';
import LeadDetailModal from './components/LeadDetailModal';
import LeadsTable from './components/LeadsTable';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdmissionWizard from '../receptionist/components/admissions/AdmissionWizard';
import ReceptionDashboard from '../receptionist/components/ReceptionDashboard';
import StudentsList from '../receptionist/components/students/StudentsList';
import StudentProfile from '../receptionist/components/students/StudentProfile';
import CollectFee from '../receptionist/components/CollectFee';
import ReceiptPage from '../receptionist/components/ReceiptPage';
import DueList from '../receptionist/components/DueList';
import PaymentHistory from '../receptionist/components/PaymentHistory';
import { courseSchema, createQuestionSchema, validateForm } from '../utils/validators';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Data State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Lead
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadForAdmission, setSelectedLeadForAdmission] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [admittingLeadId, setAdmittingLeadId] = useState(null);

  // States for shared receptionist views
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [selectedFeeStudent, setSelectedFeeStudent] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Create/Edit Course
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    course_name: '', code: '', description: '', duration_months: 6, total_fee: 0, installments_allowed: false
  });
  const [courseError, setCourseError] = useState(null);

  // Create/Edit Question
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question_text: '', step_number: 2, field_type: 'text', optionsString: '', is_required: false
  });
  const [questionError, setQuestionError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await API.get('/leads', {
        params: { search, status: statusFilter, course: courseFilter, page: currentPage, limit: 15 }
      });
      setLeads(response.data.data);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchSettingsData = async () => {
    try {
      const [coursesRes, questionsRes] = await Promise.all([
        API.get('/courses'), API.get('/questions')
      ]);
      setCourses(coursesRes.data.data);
      setQuestions(questionsRes.data.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStats();
    } else if (activeTab === 'leads') {
      fetchLeads();
    } else {
      fetchSettingsData();
    }
  }, [activeTab, search, statusFilter, courseFilter, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, courseFilter]);

  const handleOpenLead = async (lead) => {
    setSelectedLead(lead);
    try {
      const historyRes = await API.get(`/leads/${lead.id}/feedback`);
      setFeedbackHistory(historyRes.data.data);
    } catch (err) {
      console.error('Error fetching feedback history:', err);
    }
  };

  const handleAdmitStudent = (lead) => {
    setSelectedLeadForAdmission(lead);
    setActiveTab('admission-wizard');
    setSelectedLead(null);
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : 'N/A';
  };

  // Course Actions
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseError(null);
    const validation = validateForm(courseSchema, courseForm);
    if (!validation.success) {
      const msgs = Object.values(validation.errors).join(', ');
      setCourseError(msgs);
      return;
    }
    try {
      const payload = {
        course_name: courseForm.course_name,
        code: courseForm.code,
        description: courseForm.description,
        duration_months: courseForm.duration_months,
        fee_structure: {
          total_fee: courseForm.total_fee,
          installments_allowed: courseForm.installments_allowed
        }
      };
      if (editingCourseId) {
        await API.put(`/courses/${editingCourseId}`, payload);
      } else {
        await API.post('/courses', payload);
      }
      setCourseForm({ course_name: '', code: '', description: '', duration_months: 6, total_fee: 0, installments_allowed: false });
      setEditingCourseId(null);
      setShowCourseForm(false);
      fetchSettingsData();
    } catch (err) {
      setCourseError(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEditCourse = (course) => {
    setCourseForm({
      course_name: course.course_name,
      code: course.code,
      description: course.description,
      duration_months: course.duration_months,
      total_fee: course.fee_structure?.total_fee || 0,
      installments_allowed: course.fee_structure?.installments_allowed || false
    });
    setEditingCourseId(course.id);
    setShowCourseForm(true);
  };

  const handleToggleCourse = async (id) => {
    try {
      await API.delete(`/courses/${id}`);
      fetchSettingsData();
    } catch (err) {
      console.error('Error toggling course:', err);
    }
  };

  // Question Actions
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionError(null);
    const validation = validateForm(createQuestionSchema, {
      question_text: questionForm.question_text,
      step_number: Number(questionForm.step_number),
      field_type: questionForm.field_type,
      optionsString: questionForm.optionsString,
      is_required: questionForm.is_required
    });
    if (!validation.success) {
      const msgs = Object.values(validation.errors).join(', ');
      setQuestionError(msgs);
      return;
    }
    try {
      const options = questionForm.optionsString
        ? questionForm.optionsString.split(',').map(o => o.trim()).filter(Boolean)
        : [];

      const payload = {
        question_text: questionForm.question_text,
        order: questionForm.step_number,
        type: questionForm.field_type,
        options,
        is_required: questionForm.is_required
      };

      if (editingQuestionId) {
        await API.put(`/questions/${editingQuestionId}`, payload);
      } else {
        await API.post('/questions', payload);
      }
      setQuestionForm({ question_text: '', step_number: 2, field_type: 'text', optionsString: '', is_required: false });
      setEditingQuestionId(null);
      setShowQuestionForm(false);
      fetchSettingsData();
    } catch (err) {
      setQuestionError(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEditQuestion = (q) => {
    setQuestionForm({
      question_text: q.question_text,
      step_number: q.order,
      field_type: q.type,
      optionsString: q.options ? q.options.join(', ') : '',
      is_required: q.is_required
    });
    setEditingQuestionId(q.id);
    setShowQuestionForm(true);
  };

  const handleToggleQuestion = async (id) => {
    try {
      await API.delete(`/questions/${id}`);
      fetchSettingsData();
    } catch (err) {
      console.error('Error toggling question:', err);
    }
  };

  return (
    <AppLayout role="admin" activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full">
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <AnalyticsDashboard stats={stats} loadingStats={loadingStats} />
          </div>
        )}

        {/* TAB 2: STUDENT LEADS */}
        {activeTab === 'leads' && (
          <div className="animate-fade-in">
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <input type="text" className="form-input" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Enrolled">Enrolled</option>
                </select>
                <select className="form-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                  <option value="All">All Courses</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
            </div>

            <LeadsTable 
              leads={leads}
              loadingLeads={loadingLeads}
              getCourseName={getCourseName}
              handleOpenLead={handleOpenLead}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        {/* TAB 3: MANAGE COURSES */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Academic Courses</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowCourseForm(!showCourseForm);
                  setEditingCourseId(null);
                  setCourseForm({ course_name: '', code: '', description: '', duration_months: 6 });
                }}
              >
                {showCourseForm ? 'Close Form' : '+ Add Course'}
              </button>
            </div>

            {showCourseForm && (
              <div className="glass-card animate-slide-in" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>{editingCourseId ? 'Edit Course Details' : 'New Course Definition'}</h3>
                {courseError && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{courseError}</div>}
                <form onSubmit={handleCourseSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Course Name</label>
                      <input type="text" className="form-input" value={courseForm.course_name} onChange={(e) => setCourseForm({ ...courseForm, course_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course Code</label>
                      <input type="text" className="form-input" value={courseForm.code} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (in Months)</label>
                    <input type="number" className="form-input" value={courseForm.duration_months} onChange={(e) => setCourseForm({ ...courseForm, duration_months: Number(e.target.value) })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Total Fee (₹)</label>
                      <input type="number" className="form-input" value={courseForm.total_fee} onChange={(e) => setCourseForm({ ...courseForm, total_fee: e.target.value === '' ? '' : Number(e.target.value) })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Installments Allowed</label>
                      <select className="form-select" value={courseForm.installments_allowed ? 'Yes' : 'No'} onChange={(e) => setCourseForm({ ...courseForm, installments_allowed: e.target.value === 'Yes' })}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                    <label className="form-label">Course Description <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
                    <textarea className="form-textarea" rows="2" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> {editingCourseId ? 'Update Course' : 'Save Course'}
                  </button>
                </form>
              </div>
            )}

            <div className="glass-card overflow-hidden !p-0">
              {courses.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>No courses found</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Add your first academic course above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)' }}>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Code</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Course Name</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Duration</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Fee</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                      {courses.map(course => (
                        <tr key={course.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30" style={{ opacity: course.is_active ? 1 : 0.6 }}>
                          <td className="py-4 px-6 font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>{course.code}</td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{course.course_name}</div>
                            {course.description && <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{course.description}</div>}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{course.duration_months} Months</td>
                          <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                            ₹{(course.fee_structure?.total_fee || 0).toLocaleString()} 
                            <span className="block text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {course.fee_structure?.installments_allowed ? 'Installments allowed' : 'No installments'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={course.is_active ? 'badge-enrolled' : 'badge-not-interested'}>{course.is_active ? 'Active' : 'Inactive'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                onClick={() => handleEditCourse(course)}
                                title="Edit Course"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                                style={{ 
                                  background: course.is_active ? 'var(--danger-glow)' : 'var(--success-glow)', 
                                  border: `1px solid ${course.is_active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, 
                                  color: course.is_active ? 'var(--danger)' : 'var(--success)' 
                                }}
                                onClick={() => handleToggleCourse(course.id)}
                                title={course.is_active ? 'Deactivate Course' : 'Activate Course'}
                              >
                                <Power size={14} />
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
          </div>
        )}

        {/* TAB 4: MANAGE QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Form Questions (Step 2)</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowQuestionForm(!showQuestionForm);
                  setEditingQuestionId(null);
                  setQuestionForm({ question_text: '', step_number: 2, field_type: 'text', optionsString: '', is_required: false });
                }}
              >
                {showQuestionForm ? 'Close Form' : '+ Add Question'}
              </button>
            </div>

            {showQuestionForm && (
              <div className="glass-card animate-slide-in" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>{editingQuestionId ? 'Edit Question Details' : 'New Question Definition'}</h3>
                {questionError && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{questionError}</div>}
                <form onSubmit={handleQuestionSubmit}>
                  <div className="form-group">
                    <label className="form-label">Question Text</label>
                    <input type="text" className="form-input" value={questionForm.question_text} onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Field Type <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
                      <select className="form-select" value={questionForm.field_type} onChange={(e) => setQuestionForm({ ...questionForm, field_type: e.target.value })}>
                        <option value="text">Text Input</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="radio">Radio Buttons</option>
                        <option value="checkbox">Checkboxes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Wizard Step</label>
                      <input type="number" className="form-input" value={questionForm.step_number} onChange={(e) => setQuestionForm({ ...questionForm, step_number: e.target.value })} required min="2" max="3" />
                    </div>
                  </div>
                  {questionForm.field_type !== 'text' && (
                    <div className="form-group">
                      <label className="form-label">Options (Comma-separated)</label>
                      <input type="text" className="form-input" placeholder="e.g. Option A, Option B" value={questionForm.optionsString} onChange={(e) => setQuestionForm({ ...questionForm, optionsString: e.target.value })} required />
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={questionForm.is_required} onChange={(e) => setQuestionForm({ ...questionForm, is_required: e.target.checked })} style={{ accentColor: 'var(--accent-primary)' }} />
                      Mark as Required Field
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> {editingQuestionId ? 'Update Question' : 'Save Question'}
                  </button>
                </form>
              </div>
            )}

            <div className="glass-card overflow-hidden !p-0">
              {questions.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <HelpCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>No questions found</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Create your first custom field above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)' }}>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Step</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Question Text</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Required</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                        <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                      {questions.map(q => (
                        <tr key={q.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30" style={{ opacity: q.is_active ? 1 : 0.6 }}>
                          <td className="py-4 px-6 font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>Step {q.order}</td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{q.question_text}</div>
                            {q.options && q.options.length > 0 && <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>Options: {q.options.join(', ')}</div>}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>{q.type}</td>
                          <td className="py-4 px-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{q.is_required ? 'Yes' : 'No'}</td>
                          <td className="py-4 px-6">
                            <span className={q.is_active ? 'badge-enrolled' : 'badge-not-interested'}>{q.is_active ? 'Active' : 'Inactive'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                onClick={() => handleEditQuestion(q)}
                                title="Edit Question"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                                style={{ 
                                  background: q.is_active ? 'var(--danger-glow)' : 'var(--success-glow)', 
                                  border: `1px solid ${q.is_active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, 
                                  color: q.is_active ? 'var(--danger)' : 'var(--success)' 
                                }}
                                onClick={() => handleToggleQuestion(q.id)}
                                title={q.is_active ? 'Deactivate Question' : 'Activate Question'}
                              >
                                <Power size={14} />
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
          </div>
        )}

        {/* LEAD DETAIL MODAL */}
        <LeadDetailModal
          selectedLead={selectedLead}
          setSelectedLead={setSelectedLead}
          getCourseName={getCourseName}
          questions={questions}
          feedbackHistory={feedbackHistory}
          user={user}
          handleAdmitStudent={handleAdmitStudent}
          admittingLeadId={admittingLeadId}
          fetchLeads={fetchLeads}
        />

        {/* NEW TABS FOR FEE MANAGEMENT */}
        {activeTab === 'fee_dashboard' && <FeeDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <AdminSettings />}

        {activeTab === 'daily-operations' && <ReceptionDashboard />}
        
        {activeTab === 'students' && (
          selectedStudentProfile ?
            <StudentProfile student={selectedStudentProfile} onBack={() => setSelectedStudentProfile(null)} /> :
            <StudentsList
              onViewProfile={setSelectedStudentProfile}
              onEditStudent={handleOpenLead}
              onCollectFee={(student) => { setSelectedFeeStudent(student); setActiveTab('collect-fee'); }}
              onEnrollNew={() => { setSelectedLeadForAdmission(null); setActiveTab('admission-wizard'); }}
            />
        )}

        {activeTab === 'collect-fee' && <CollectFee student={selectedFeeStudent} onPaymentSuccess={(tab) => { if (tab) setActiveTab(tab); else { setActiveTab('students'); setSelectedFeeStudent(null); } }} />}
        {activeTab === 'receipt' && <ReceiptPage transaction={selectedTransaction} onBack={() => { setActiveTab('payment-history'); setSelectedTransaction(null); }} />}
        {activeTab === 'due-list' && <DueList onCollectFee={(student) => { setSelectedFeeStudent(student); setActiveTab('collect-fee'); }} />}
        {activeTab === 'payment-history' && <PaymentHistory onViewReceipt={(txn) => { setSelectedTransaction(txn); setActiveTab('receipt'); }} />}

        {activeTab === 'admission-wizard' && (
          <AdmissionWizard
            lead={selectedLeadForAdmission}
            courses={courses}
            questions={questions}
            onComplete={() => { setActiveTab('leads'); setSelectedLeadForAdmission(null); fetchLeads(); fetchStats(); }}
            onCancel={() => { setSelectedLeadForAdmission(null); setActiveTab('leads'); }}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
