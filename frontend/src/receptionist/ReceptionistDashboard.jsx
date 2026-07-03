/**
 * @file ReceptionistDashboard.jsx
 * @description Receptionist view to search, filter, track leads, and write follow-up feedback.
 */

import React, { useState, useEffect } from 'react';
import { Zap, LayoutDashboard, Search, Clock, History, Settings, X, Save, Menu, LogOut, Users, UserPlus, CreditCard } from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import ReceptionDashboard from './components/ReceptionDashboard';
import StudentSearch from './components/StudentSearch';
import CollectFee from './components/CollectFee';
import ReceiptPage from './components/ReceiptPage';
import DueList from './components/DueList';
import PaymentHistory from './components/PaymentHistory';
import ReceptionSettings from './components/settings/ReceptionSettings';
import StudentLeads from './components/StudentLeads';
import AdmissionWizard from './components/admissions/AdmissionWizard';
import StudentsList from './components/students/StudentsList';
import StudentProfile from './components/students/StudentProfile';
import AppLayout from '../layouts/AppLayout';

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('registry'); // registry, dashboard, search, collect, receipt, dues, history
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Cross-component state
  const [selectedFeeStudent, setSelectedFeeStudent] = useState(null);
  const [selectedLeadForAdmission, setSelectedLeadForAdmission] = useState(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);

  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, me, unassigned

  // Active Lead (for Modal)
  const [selectedLead, setSelectedLead] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Fetch leads and metadata
  const fetchData = async () => {
    try {
      const [leadsRes, coursesRes, questionsRes] = await Promise.all([
        API.get('/leads', {
          params: {
            search,
            status: statusFilter,
            course: courseFilter,
            assignedTo: assignmentFilter
          }
        }),
        API.get('/courses'),
        API.get('/questions')
      ]);
      setLeads(leadsRes.data.data);
      setCourses(coursesRes.data.data);
      setQuestions(questionsRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, courseFilter, assignmentFilter]);

  // Open Lead Modal & Fetch Feedback History
  const handleOpenLead = async (lead) => {
    setSelectedLead(lead);
    setUpdatingStatus(lead.status);
    setNewFeedbackText('');
    setNextFollowUpDate('');
    try {
      const historyRes = await API.get(`/leads/${lead.id}/feedback`);
      setFeedbackHistory(historyRes.data.data);
    } catch (err) {
      console.error('Error fetching feedback history:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setFeedbackHistory([]);
  };

  const handleEnrollLead = (lead) => {
    setSelectedLeadForAdmission(lead);
    setActiveTab('admissions');
  };

  // Submit new feedback / remark
  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;
    setModalSubmitting(true);
    try {
      const response = await API.post(`/leads/${selectedLead.id}/feedback`, {
        feedback_text: newFeedbackText,
        next_follow_up_date: nextFollowUpDate || null
      });

      setFeedbackHistory(response.data.data.history);
      setNewFeedbackText('');
      setNextFollowUpDate('');
      fetchData();
    } catch (err) {
      console.error('Error adding feedback:', err);
    } finally {
      setModalSubmitting(false);
    }
  };

  // Update lead status
  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      await API.patch(`/leads/${selectedLead.id}/status`, { status: newStatus });
      setSelectedLead(prev => ({ ...prev, status: newStatus }));
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : 'N/A';
  };

  return (
    <AppLayout role="receptionist" activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full">
        {activeTab === 'registry' && (
          <StudentLeads 
            leads={leads}
            loading={loading}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            courseFilter={courseFilter}
            setCourseFilter={setCourseFilter}
            assignmentFilter={assignmentFilter}
            setAssignmentFilter={setAssignmentFilter}
            courses={courses}
            onViewLead={handleOpenLead}
            onEnrollLead={handleEnrollLead}
          />
        )}

        {/* FEE MANAGEMENT TABS */}
        {activeTab === 'dashboard' && <ReceptionDashboard />}
        {activeTab === 'students' && (
          selectedStudentProfile ? 
            <StudentProfile student={selectedStudentProfile} onBack={() => setSelectedStudentProfile(null)} /> : 
            <StudentsList onViewProfile={setSelectedStudentProfile} onCollectFee={(student) => { setSelectedFeeStudent(student); setActiveTab('collection'); }} />
        )}
        {activeTab === 'collection' && <CollectFee student={selectedFeeStudent} onPaymentSuccess={(tab) => { if (tab) setActiveTab(tab); else { setActiveTab('students'); setSelectedFeeStudent(null); } }} />}
        {activeTab === 'receipt' && <ReceiptPage />}
        {activeTab === 'dues' && <DueList />}
        {activeTab === 'history' && <PaymentHistory />}
        {activeTab === 'settings' && <ReceptionSettings />}
        {activeTab === 'admissions' && (
          <AdmissionWizard 
            lead={selectedLeadForAdmission} 
            courses={courses} 
            onComplete={() => setActiveTab('students')}
            onCancel={() => { setSelectedLeadForAdmission(null); setActiveTab('registry'); }}
          />
        )}
      </div>
      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '850px', width: '100%', maxHeight: '90vh',
            overflowY: 'auto', padding: '2.5rem', position: 'relative', background: 'var(--bg-surface)'
          }}>
            <button style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer'
            }} onClick={handleCloseModal}>
              <X size={24} />
            </button>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
              <span className={`badge badge-${selectedLead.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '0.5rem' }}>{selectedLead.status}</span>
              <h2 style={{ fontSize: '1.5rem' }}>{selectedLead.full_name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Submitted: {new Date(selectedLead.submitted_at).toLocaleString()}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {/* Split layout for large screens */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                {/* Left: Info */}
                <div>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                    {selectedLead.filler_type === 'guardian' ? 'Student Details' : 'Personal Details'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email</label><span>{selectedLead.email || 'N/A'}</span></div>
                    <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone</label><span>{selectedLead.mobile_number || 'N/A'}</span></div>
                    <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>City</label><span>{selectedLead.city}</span></div>
                    <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Course Interest</label><span style={{ color: 'var(--accent)', fontWeight: 600 }}>{getCourseName(selectedLead.interested_course_id)}</span></div>
                  </div>

                  {selectedLead.filler_type === 'guardian' && (
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>Guardian Contact Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Guardian Name</label><span>{selectedLead.guardian_name}</span></div>
                        <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Relationship</label><span>{selectedLead.guardian_relation}</span></div>
                        <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Guardian Phone</label><span>{selectedLead.guardian_phone}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Responses */}
                  {selectedLead.responses && selectedLead.responses.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>Qualifying Answers</h4>
                      {selectedLead.responses.map(resp => {
                        const q = questions.find(question => question.id === resp.question_id);
                        return (
                          <div key={resp.question_id} style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block' }}>{q ? q.question_text : 'Question'}</span>
                            <span>{resp.response_value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Step 3 Feedback */}
                  {selectedLead.feedback && (
                    <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Student Comments</h4>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><strong style={{ color: 'var(--text-muted)' }}>Source:</strong> {selectedLead.feedback.source}</p>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-muted)' }}>Experience:</strong> {selectedLead.feedback.rating} / 5</p>
                      {selectedLead.feedback.comments && (
                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border)' }}>
                          "{selectedLead.feedback.comments}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: CRM */}
                <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>CRM Actions</h3>

                  {/* Status */}
                  <div className="form-group">
                    <label className="form-label">Pipeline Status</label>
                    <select className="form-select" value={updatingStatus} onChange={(e) => handleStatusUpdate(e.target.value)}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Enrolled">Enrolled</option>
                    </select>
                  </div>

                  {/* Add Feedback */}
                  <form onSubmit={handleAddFeedback} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Add Counselor Remarks</label>
                      <textarea className="form-textarea" rows="3" placeholder="Write call details, preferences, etc..." value={newFeedbackText} onChange={(e) => setNewFeedbackText(e.target.value)} required></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Next Follow-up Date (Optional)</label>
                      <input type="date" className="form-input" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={modalSubmitting}>
                      {modalSubmitting ? 'Saving...' : <><Save size={18} /> Save Remarks</>}
                    </button>
                  </form>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Follow-up history</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                      {feedbackHistory.length === 0 ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No follow-up remarks recorded.</span>
                      ) : (
                        feedbackHistory.map(log => (
                          <div key={log.id} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                              <span>{log.staff_id === user.id ? 'You' : 'Counselor'}</span>
                              <span>{new Date(log.created_at).toLocaleDateString()}</span>
                            </div>
                            <p style={{ color: 'var(--text-main)' }}>{log.feedback_text}</p>
                            {log.next_follow_up_date && (
                              <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 500 }}>
                                Next Follow-up: {new Date(log.next_follow_up_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

  export default ReceptionistDashboard;
