/**
 * @file leadController.js
 * @description Controller for managing student inquiries (leads).
 */

const { generateId, leads, feedbackLogs, courses } = require('../../database/store');

// @desc    Create a new lead (Student Form Submission)
// @route   POST /api/leads
// @access  Public
const createLead = (req, res) => {
  const {
    filler_type,
    guardian_name,
    guardian_relation,
    guardian_phone,
    full_name,
    email,
    mobile_number,
    city,
    interested_course_id,
    responses,
    feedback
  } = req.body;

  // Validate required fields dynamically
  if (filler_type === 'guardian') {
    if (!full_name || !city || !guardian_name || !guardian_relation || !guardian_phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required basic details, including guardian details' });
    }
  } else {
    if (!full_name || !email || !mobile_number || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required basic details' });
    }
  }

  // Verify course exists if provided
  if (interested_course_id) {
    const courseExists = courses.find(c => c.id === interested_course_id);
    if (!courseExists) {
      return res.status(400).json({ success: false, message: 'Invalid course selected' });
    }
  }

  // Create new lead object
  const newLead = {
    id: 'lead_' + generateId(),
    filler_type: filler_type || 'student',
    guardian_name: filler_type === 'guardian' ? guardian_name : undefined,
    guardian_relation: filler_type === 'guardian' ? guardian_relation : undefined,
    guardian_phone: filler_type === 'guardian' ? guardian_phone : undefined,
    full_name,
    email: email || '',
    mobile_number: mobile_number || '',
    city,
    interested_course_id: interested_course_id || null,
    status: 'New',
    assigned_to_staff_id: null,
    submitted_at: new Date(),
    updated_at: new Date(),
    responses: responses || [], // Array of { question_id, response_value }
    feedback: {
      rating: feedback?.rating || 5,
      source: feedback?.source || 'Direct',
      comments: feedback?.comments || ''
    }
  };

  // Save to in-memory store
  leads.push(newLead);

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully!',
    data: newLead
  });
};

// @desc    Get all leads (with filters & search)
// @route   GET /api/leads
// @access  Private (Admin, Receptionist)
const getLeads = (req, res) => {
  let filteredLeads = [...leads];
  const { search, status, course, assignedTo } = req.query;

  // Search filter (name, email, mobile)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredLeads = filteredLeads.filter(
      lead =>
        lead.full_name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.mobile_number.includes(searchLower) ||
        lead.city.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (status && status !== 'All') {
    filteredLeads = filteredLeads.filter(lead => lead.status === status);
  }

  // Course filter
  if (course && course !== 'All') {
    filteredLeads = filteredLeads.filter(lead => lead.interested_course_id === course);
  }

  // Assigned Staff filter
  if (assignedTo) {
    if (assignedTo === 'me') {
      filteredLeads = filteredLeads.filter(lead => lead.assigned_to_staff_id === req.user.id);
    } else if (assignedTo === 'unassigned') {
      filteredLeads = filteredLeads.filter(lead => !lead.assigned_to_staff_id);
    } else if (assignedTo !== 'All') {
      filteredLeads = filteredLeads.filter(lead => lead.assigned_to_staff_id === assignedTo);
    }
  }

  // Sort by submitted_at descending (newest first)
  filteredLeads.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  res.status(200).json({
    success: true,
    count: filteredLeads.length,
    data: filteredLeads
  });
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private (Admin, Receptionist)
const updateLeadStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  // Update status and last updated timestamp
  lead.status = status;
  lead.updated_at = new Date();

  // Auto-assign to the receptionist if it's currently unassigned and they are updating it
  if (!lead.assigned_to_staff_id && req.user.role === 'receptionist') {
    lead.assigned_to_staff_id = req.user.id;
  }

  res.status(200).json({
    success: true,
    message: 'Lead status updated successfully',
    data: lead
  });
};

// @desc    Add follow-up feedback log for a lead
// @route   POST /api/leads/:id/feedback
// @access  Private (Admin, Receptionist)
const addLeadFeedback = (req, res) => {
  const { id } = req.params;
  const { feedback_text, next_follow_up_date } = req.body;

  if (!feedback_text) {
    return res.status(400).json({ success: false, message: 'Feedback text is required' });
  }

  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  // Create feedback log
  const newLog = {
    id: 'f_log_' + generateId(),
    lead_id: id,
    staff_id: req.user.id,
    feedback_text,
    next_follow_up_date: next_follow_up_date ? new Date(next_follow_up_date) : null,
    created_at: new Date()
  };

  feedbackLogs.push(newLog);

  // Update lead's updated_at timestamp
  lead.updated_at = new Date();

  // If receptionist adds feedback, auto-assign lead if unassigned
  if (!lead.assigned_to_staff_id && req.user.role === 'receptionist') {
    lead.assigned_to_staff_id = req.user.id;
  }

  // Return the new log and the updated feedback logs for this lead
  const leadLogs = feedbackLogs.filter(log => log.lead_id === id);

  res.status(201).json({
    success: true,
    message: 'Follow-up remark added',
    data: {
      log: newLog,
      history: leadLogs
    }
  });
};

// @desc    Get feedback logs history for a lead
// @route   GET /api/leads/:id/feedback
// @access  Private (Admin, Receptionist)
const getLeadFeedbackHistory = (req, res) => {
  const { id } = req.params;

  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const history = feedbackLogs.filter(log => log.lead_id === id);
  // Sort by created_at descending (newest first)
  history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.status(200).json({
    success: true,
    data: history
  });
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  addLeadFeedback,
  getLeadFeedbackHistory
};
