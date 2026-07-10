import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layouts/AppLayout';
import FeeDashboard from './components/FeeDashboard';
import FeeStructure from './components/FeeStructure';
import DiscountManagement from './components/DiscountManagement';
import Reports from './components/Reports';
import AdminSettings from './components/settings/AdminSettings';
import LeadDetailModal from './components/LeadDetailModal';
import LeadsTable from './components/LeadsTable';
import AnalyticsDashboard from './components/AnalyticsDashboard';
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
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [admittingLeadId, setAdmittingLeadId] = useState(null);

  // Create/Edit Course
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    course_name: '', code: '', description: '', duration_months: 6
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

  const handleAdmitStudent = async (lead) => {
    if (!window.confirm(`Are you sure you want to admit ${lead.full_name} as an official student?`)) {
      return;
    }
    setAdmittingLeadId(lead.id || lead._id);
    try {
      await API.post(`/v2/students/admit/${lead.id || lead._id}`);
      alert('Student admitted successfully!');
      setSelectedLead(null);
      fetchLeads(); // Refresh leads table
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Error admitting student:', err);
      alert(err.response?.data?.message || 'Failed to admit student');
    } finally {
      setAdmittingLeadId(null);
    }
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
      if (editingCourseId) {
        await API.put(`/courses/${editingCourseId}`, courseForm);
      } else {
        await API.post('/courses', courseForm);
      }
      setCourseForm({ course_name: '', code: '', description: '', duration_months: 6 });
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
      duration_months: course.duration_months
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
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Course Description</label>
                    <textarea className="form-textarea" rows="2" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> {editingCourseId ? 'Update Course' : 'Save Course'}
                  </button>
                </form>
              </div>
            )}

            <div className="glass-card" style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Code</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Course Name</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Duration</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: course.is_active ? 1 : 0.6 }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{course.code}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{course.course_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.description}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{course.duration_months} M</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className={`badge ${course.is_active ? 'badge-enrolled' : 'badge-not-interested'}`}>{course.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', gap: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEditCourse(course)}>Edit</button>
                        <button className={`btn ${course.is_active ? 'btn-danger' : 'btn-secondary'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleToggleCourse(course.id)}>{course.is_active ? 'Deactivate' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      <label className="form-label">Field Type</label>
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

            <div className="glass-card" style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Step</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Question Text</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Type</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Required</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: q.is_active ? 1 : 0.6 }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Step {q.order}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{q.question_text}</div>
                        {q.options && q.options.length > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Options: {q.options.join(', ')}</div>}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{q.type}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{q.is_required ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className={`badge ${q.is_active ? 'badge-enrolled' : 'badge-not-interested'}`}>{q.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', gap: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEditQuestion(q)}>Edit</button>
                        <button className={`btn ${q.is_active ? 'btn-danger' : 'btn-secondary'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleToggleQuestion(q.id)}>{q.is_active ? 'Deactivate' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        />

        {/* NEW TABS FOR FEE MANAGEMENT */}
        {activeTab === 'fee_dashboard' && <FeeDashboard />}
        {activeTab === 'fee_structure' && <FeeStructure />}
        {activeTab === 'discounts' && <DiscountManagement />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
