/**
 * @file leadController.js
 * @description Controller for managing student inquiries (leads) using MongoDB.
 */

const Lead = require('./lead.model');
const FeedbackLog = require('./feedbacklog.model');

// @desc    Create a new lead (Student Form Submission)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
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
      qualification,
      currentClass,
      interestedCourse,
      interestedSubject,
      preferredBatch,
      learningMode,
      queries,
      careerGoal,
      remarks,
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

    // Create new lead object mapping fields
    const newLead = new Lead({
      filler_type: filler_type || 'student',
      guardian_name: filler_type === 'guardian' ? guardian_name : undefined,
      guardian_relation: filler_type === 'guardian' ? guardian_relation : undefined,
      guardian_phone: filler_type === 'guardian' ? guardian_phone : undefined,
      full_name,
      email: email || '',
      mobile_number: mobile_number || '',
      city,
      interested_course_id: interested_course_id || null,
      qualification,
      currentClass,
      interestedCourse,
      interestedSubject,
      preferredBatch,
      learningMode,
      queries,
      careerGoal,
      remarks,
      status: 'New',
      assigned_to_staff_id: null,
      responses: responses || [],
      feedback: {
        rating: feedback?.rating || 5,
        source: feedback?.source || 'Direct',
        comments: feedback?.comments || ''
      }
    });

    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      data: savedLead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Server error creating lead' });
  }
};

// @desc    Get all leads (with filters & search)
// @route   GET /api/leads
// @access  Private (Admin, Receptionist)
const getLeads = async (req, res) => {
  try {
    const { search, status, course, assignedTo, page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    let query = { deleted_at: null };

    // Search filter (name, email, mobile, city, or ID)
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      const orConditions = [
        { full_name: searchRegex },
        { email: searchRegex },
        { mobile_number: searchRegex },
        { city: searchRegex }
      ];

      // Strictly check for 24-character hex string to avoid 12-character name collisions (e.g., "Rahul Sharma")
      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        orConditions.push({ _id: search });
      }

      query.$or = orConditions;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Course filter
    if (course && course !== 'All') {
      query.interested_course_id = course;
    }

    // Assigned Staff filter
    if (assignedTo) {
      if (assignedTo === 'me') {
        query.assigned_to_staff_id = req.user.id;
      } else if (assignedTo === 'unassigned') {
        query.assigned_to_staff_id = null;
      } else if (assignedTo !== 'All') {
        query.assigned_to_staff_id = assignedTo;
      }
    }

    // Execute query and sort by submitted_at descending with pagination
    const leads = await Lead.find(query)
      .sort({ submitted_at: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalLeads = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total: totalLeads,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalLeads / limitNum)
      },
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leads' });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private (Admin, Receptionist)
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.status = status;
    lead.updated_at = new Date();

    // Auto-assign to the receptionist if it's currently unassigned and they are updating it
    if (!lead.assigned_to_staff_id && req.user && req.user.role === 'receptionist') {
      lead.assigned_to_staff_id = req.user.id;
    }

    const updatedLead = await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: updatedLead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ success: false, message: 'Server error updating lead status' });
  }
};

// @desc    Add follow-up feedback log for a lead
// @route   POST /api/leads/:id/feedback
// @access  Private (Admin, Receptionist)
const addLeadFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback_text, next_follow_up_date } = req.body;

    if (!feedback_text) {
      return res.status(400).json({ success: false, message: 'Feedback text is required' });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Create feedback log
    const newLog = new FeedbackLog({
      lead_id: lead._id,
      staff_id: req.user ? req.user.id : 'unknown', // Fallback in case auth isn't fully set up yet
      feedback_text,
      next_follow_up_date: next_follow_up_date ? new Date(next_follow_up_date) : null
    });

    await newLog.save();

    // Update lead's updated_at timestamp
    lead.updated_at = new Date();

    // Auto-assign if receptionist adds feedback
    if (!lead.assigned_to_staff_id && req.user && req.user.role === 'receptionist') {
      lead.assigned_to_staff_id = req.user.id;
    }

    await lead.save();

    // Get updated history
    const history = await FeedbackLog.find({ lead_id: id }).sort({ created_at: -1 });

    res.status(201).json({
      success: true,
      message: 'Follow-up remark added',
      data: {
        log: newLog,
        history
      }
    });
  } catch (error) {
    console.error('Error adding lead feedback:', error);
    res.status(500).json({ success: false, message: 'Server error adding lead feedback' });
  }
};

// @desc    Get feedback logs history for a lead
// @route   GET /api/leads/:id/feedback
// @access  Private (Admin, Receptionist)
const getLeadFeedbackHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const history = await FeedbackLog.find({ lead_id: id }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching lead feedback history:', error);
    res.status(500).json({ success: false, message: 'Server error fetching feedback history' });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  addLeadFeedback,
  getLeadFeedbackHistory
};
