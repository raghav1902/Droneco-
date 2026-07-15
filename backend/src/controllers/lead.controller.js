/**
 * @file leadController.js
 * @description Controller for managing student inquiries (leads) using MongoDB.
 */

const Lead = require('../models/lead.model');
const FeedbackLog = require('../models/feedbacklog.model');
const Settings = require('../models/settings.model');
const Fee = require('../models/fee.model');

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
        // Note: Guardian, Address, Category, Blood Group, Religion, Disability, and Qualification 
        // fields have been removed from the public lead form to simplify the flow.
        // They will be collected during the Student Admission Wizard.
        
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
    let limitNum = parseInt(limit, 10) || 50;
    limitNum = Math.min(limitNum, 50); // Strictly cap limit to 50 to prevent scraping
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

    // Note: Auto-assignment removed to prevent unintended hijacking of leads

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

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User is missing' });
    }

    // Create feedback log
    const newLog = new FeedbackLog({
      lead_id: lead._id,
      staff_id: req.user.id,
      feedback_text,
      next_follow_up_date: next_follow_up_date ? new Date(next_follow_up_date) : null
    });

    await newLog.save();

    // Update lead's updated_at timestamp
    lead.updated_at = new Date();

    // Note: Auto-assignment removed

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
    console.error('Add Feedback Error:', error);
    res.status(500).json({ success: false, message: 'Server error adding feedback' });
  }
};

// @desc    Update lead details (Admin/Receptionist edit)
// @route   PUT /api/admin/leads/:id or /api/receptionist/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find lead
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Role-based Ownership Guard: Receptionists can only edit leads assigned to them or unassigned leads
    if (req.user.role === 'receptionist' || req.user.role === 'Counselor') {
      if (lead.assigned_to_staff_id && lead.assigned_to_staff_id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only edit leads assigned to you or unassigned leads.' });
      }
      
      // Auto-assignment for unassigned leads has been removed. Receptionist must explicitly assign.
    }

    // Define strictly allowed top-level fields that can be updated via this endpoint
    const allowedFields = [
      'full_name', 'middle_name', 'last_name', 'gender', 'dob', 'blood_group',
      'category', 'nationality', 'aadhaar_number', 'email', 'mobile_number', 'city',
      'marital_status', 'identification_mark_1', 'identification_mark_2',
      'disability_status', 'disability_description', 'preferred_language',
      'alternate_mobile', 'personal_email', 'permanent_address', 'current_address',
      'qualification', 'currentClass', 'interested_course_id', 'interestedCourse',
      'interestedSubject', 'preferredBatch', 'learningMode', 'father', 'mother',
      'guardian', 'emergency_contact', 'previous_qualification', 'tenth_details',
      'twelfth_details', 'admission_year', 'department', 'branch', 'semester',
      'section', 'mode_of_admission', 'queries', 'careerGoal', 'remarks', 'responses',
      'photo_url', 'signature_url'
    ];

    const updateData = req.body;
    
    // Safely update nested objects without custom deep merge loop
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
          // Mark nested object as modified explicitly for mongoose
          Object.assign(lead[key], updateData[key]);
          lead.markModified(key);
        } else {
          lead[key] = updateData[key];
        }
      }
    }

    lead.updated_at = new Date();
    const updatedLead = await lead.save();

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    console.error('Update Lead Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating lead' });
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

// @desc    Soft delete a lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (lead.status === 'Enrolled') {
      return res.status(400).json({ success: false, message: 'Cannot delete a lead that has already been enrolled. Please manage them via the Students tab.' });
    }

    // Soft delete
    lead.is_deleted = true;
    lead.deleted_at = new Date();
    await lead.save();

    // Soft delete associated pending fees so they don't skew financial reports
    await Fee.updateMany({ lead_id: id }, { is_deleted: true });

    // Soft delete associated FeedbackLogs
    const FeedbackLog = require('../models/feedbacklog.model');
    await FeedbackLog.updateMany({ lead_id: id }, { is_deleted: true });
    
    // Soft delete associated Payments via the soft-deleted fees
    const Payment = require('../models/payment.model');
    const fees = await Fee.find({ lead_id: id });
    const feeIds = fees.map(f => f._id);
    await Payment.updateMany({ fee_id: { $in: feeIds } }, { status: 'FAILED' }); // or use is_deleted if available

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Server error deleting lead' });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  addLeadFeedback,
  getLeadFeedbackHistory,
  updateLead,
  deleteLead
};
