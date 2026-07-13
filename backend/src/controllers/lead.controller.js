/**
 * @file leadController.js
 * @description Controller for managing student inquiries (leads) using MongoDB.
 */

const Lead = require('../models/lead.model');
const FeedbackLog = require('../models/feedbacklog.model');
const Settings = require('../models/settings.model');

// @desc    Create a new lead (Student Form Submission)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    // Validate required fields dynamically (basic checks are now handled by Zod)
    if (req.body.filler_type === 'guardian') {
      if (!req.body.full_name || !req.body.city || !req.body.guardian?.first_name || !req.body.guardian?.mobile_number) {
        return res.status(400).json({ success: false, message: 'Please provide all required basic details, including guardian details' });
      }
    } else {
      if (!req.body.full_name || !req.body.email || !req.body.mobile_number || !req.body.city) {
        return res.status(400).json({ success: false, message: 'Please provide all required basic details' });
      }
    }

    // Dynamic Validation based on formConfig
    const settings = await Settings.findOne();
    if (settings && settings.formConfig) {
      const config = settings.formConfig;
      
      const checkRequired = (key, value, fieldName) => {
        if (config[key] && config[key].visible !== false && config[key].required && !value) {
          throw new Error(`${fieldName} is required by form configuration`);
        }
      };

      try {
        if (req.body.filler_type !== 'guardian') checkRequired('guardian', req.body.guardian?.first_name, 'Guardian Details');
        checkRequired('address', req.body.permanent_address?.city, 'Permanent Address City');
        checkRequired('media', req.body.photo_url, 'Photo');
        checkRequired('media', req.body.signature_url, 'Signature');
        checkRequired('category', req.body.category, 'Category');
        checkRequired('blood_group', req.body.blood_group, 'Blood Group');
        checkRequired('religion', req.body.religion, 'Religion');
        checkRequired('marital_status', req.body.marital_status, 'Marital Status');
        checkRequired('identification_marks', req.body.identification_mark_1, 'Identification Mark 1');
        checkRequired('disability', req.body.disability_status, 'Disability Status');
        checkRequired('qualification', req.body.previous_qualification?.school_college_name, 'Previous Qualification (School/College Name)');
        
        // Validate custom fields
        if (config.customFields && Array.isArray(config.customFields)) {
          config.customFields.forEach(field => {
            if (field.visible !== false && field.required && !req.body[field.id]) {
               throw new Error(`Custom field "${field.label}" is required`);
            }
          });
        }
      } catch (validationErr) {
        return res.status(400).json({ success: false, message: validationErr.message });
      }
    }

    const payloadData = { ...req.body };
    for (const key in payloadData) {
      if (payloadData[key] === '') {
        delete payloadData[key];
      }
    }

    // Transform responses from Object to Array format for MongoDB schema
    if (payloadData.responses && !Array.isArray(payloadData.responses) && typeof payloadData.responses === 'object') {
      payloadData.responses = Object.entries(payloadData.responses).map(([k, v]) => ({
        question_id: k,
        response_value: v
      }));
    }

    // Create new lead object directly from validated req.body
    const newLead = new Lead({
      ...payloadData,
      status: 'New',
      assigned_to_staff_id: null
    });

    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      data: savedLead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
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
