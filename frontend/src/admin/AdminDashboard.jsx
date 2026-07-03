import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layouts/AppLayout';
import FeeDashboard from './components/FeeDashboard';
import FeeStructure from './components/FeeStructure';
import FeeRules from './components/FeeRules';
import DiscountManagement from './components/DiscountManagement';
import Reports from './components/Reports';
import AdminSettings from './components/settings/AdminSettings';

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

  // Lead Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  // Selected Lead
  const [selectedLead, setSelectedLead] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

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
        params: { search, status: statusFilter, course: courseFilter }
      });
      setLeads(response.data.data);
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
  }, [activeTab, search, statusFilter, courseFilter]);

  const handleOpenLead = async (lead) => {
    setSelectedLead(lead);
    try {
      const historyRes = await API.get(`/leads/${lead.id}/feedback`);
      setFeedbackHistory(historyRes.data.data);
    } catch (err) {
      console.error('Error fetching feedback history:', err);
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
    try {
      const options = questionForm.optionsString
        ? questionForm.optionsString.split(',').map(o => o.trim()).filter(Boolean)
        : [];

      const payload = {
        question_text: questionForm.question_text,
        step_number: questionForm.step_number,
        field_type: questionForm.field_type,
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
      step_number: q.step_number,
      field_type: q.field_type,
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
            {loadingStats ? (
              <div className="spinner-container"><div className="spinner"></div></div>
            ) : !stats ? (
              <p>No statistics available.</p>
            ) : (
              <div>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total Inquiries</span>
                    <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.totalLeads}</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Conversions (Enrolled)</span>
                    <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.enrolledLeads}</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Conversion Rate</span>
                    <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.conversionRate}%</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-hex)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Active Follow-ups</span>
                    <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{stats.summary.pendingFollowUps}</h3>
                  </div>
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                  {/* Leads by Status */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Inquiries by Pipeline Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {stats.leadsByStatus.map((item, index) => {
                        const percent = stats.summary.totalLeads > 0 ? (item.value / stats.summary.totalLeads) * 100 : 0;
                        return (
                          <div key={item.name} style={{ 
                            padding: '1.25rem 0',
                            borderBottom: index !== stats.leadsByStatus.length - 1 ? '1px solid var(--border-color)' : 'none'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--text-main)' }}>{item.value}</span> ({percent.toFixed(0)}%)
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${percent}%`,
                                height: '100%',
                                background: item.name === 'Enrolled' ? 'var(--success)' : item.name === 'New' ? 'var(--text-muted)' : 'var(--text-muted)',
                                borderRadius: '2px',
                                transition: 'width 1s ease-in-out'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Leads by Course */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Inquiries by Course Choice</h3>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {stats.leadsByCourse.map((item, index) => {
                        const percent = stats.summary.totalLeads > 0 ? (item.value / stats.summary.totalLeads) * 100 : 0;
                        return (
                          <div key={item.name} style={{ 
                            padding: '1.25rem 0',
                            borderBottom: index !== stats.leadsByCourse.length - 1 ? '1px solid var(--border-color)' : 'none'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--text-main)' }}>{item.value}</span> ({percent.toFixed(0)}%)
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${percent}%`,
                                height: '100%',
                                background: 'var(--accent-hex)',
                                borderRadius: '2px',
                                transition: 'width 1s ease-in-out'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <input type="number" className="form-input" value={courseForm.duration_months} onChange={(e) => setCourseForm({ ...courseForm, duration_months: e.target.value })} required />
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
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Step {q.step_number}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{q.question_text}</div>
                        {q.options && q.options.length > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Options: {q.options.join(', ')}</div>}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{q.field_type}</td>
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
        {selectedLead && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)'
          }}>
            <div className="glass-card animate-fade-in" style={{
              maxWidth: '600px', width: '100%', maxHeight: '85vh',
              overflowY: 'auto', padding: '2rem', position: 'relative', background: 'var(--bg-surface)'
            }}>
              <button style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedLead(null)}>
                <X size={24} />
              </button>

              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <span className={`badge badge-${selectedLead.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '0.5rem' }}>{selectedLead.status}</span>
                <h2 style={{ fontSize: '1.5rem' }}>{selectedLead.full_name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Submitted: {new Date(selectedLead.submitted_at).toLocaleString()}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Contact details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email</label><span>{selectedLead.email || 'N/A'}</span></div>
                  <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone</label><span>{selectedLead.mobile_number || 'N/A'}</span></div>
                  <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>City</label><span>{selectedLead.city}</span></div>
                  <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Course Interest</label><span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{getCourseName(selectedLead.interested_course_id)}</span></div>
                </div>

                {/* Guardian details if applicable */}
                {selectedLead.filler_type === 'guardian' && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Guardian Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Guardian Name:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_name}</span></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Relationship:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_relation}</span></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Guardian Phone:</span> <span style={{ fontWeight: 500 }}>{selectedLead.guardian_phone}</span></div>
                    </div>
                  </div>
                )}

                {/* Dynamic Qs */}
                {selectedLead.responses && selectedLead.responses.length > 0 && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Qualifying Answers</h4>
                    {selectedLead.responses.map(resp => {
                      const q = questions.find(question => question.id === resp.question_id);
                      return (
                        <div key={resp.question_id} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>{q ? q.question_text : 'Question'}</span>
                          <span style={{ fontWeight: 500 }}>{resp.response_value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Remarks History */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Follow-up remarks</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {feedbackHistory.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No follow-up remarks recorded.</span>
                    ) : (
                      feedbackHistory.map(log => (
                        <div key={log.id} style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                            <span>{log.staff_id === user.id ? 'You' : 'Counselor'}</span>
                            <span>{new Date(log.created_at).toLocaleDateString()}</span>
                          </div>
                          <p>{log.feedback_text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW TABS FOR FEE MANAGEMENT */}
        {activeTab === 'fee_dashboard' && <FeeDashboard />}
        {activeTab === 'fee_structure' && <FeeStructure />}
        {activeTab === 'fee_rules' && <FeeRules />}
        {activeTab === 'discounts' && <DiscountManagement />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
