/**
 * @file feeController.js
 * @description Controller for managing student fees.
 */

const Fee = require('../models/fee.model');
const Lead = require('../models/lead.model');
const Course = require('../models/course.model');

// @desc    Assign a fee structure to a student
// @route   POST /api/fees
// @access  Private (Admin, Receptionist)
const createFee = async (req, res) => {
  try {
    const { lead_id, course_id, total_amount, discount_amount, tax_amount } = req.body;

    if (!lead_id || !course_id || total_amount === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if Fee already exists for this lead and course
    const existingFee = await Fee.findOne({ lead_id, course_id });
    if (existingFee) {
      return res.status(400).json({ success: false, message: 'Fee structure already assigned for this course to this student' });
    }

    const net_payable = Number(total_amount) - (Number(discount_amount) || 0) + (Number(tax_amount) || 0);

    const newFee = await Fee.create({
      lead_id,
      course_id,
      total_amount,
      discount_amount: discount_amount || 0,
      tax_amount: tax_amount || 0,
      net_payable,
      paid_amount: 0,
      due_amount: net_payable,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Fee structure assigned successfully',
      data: newFee
    });
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ success: false, message: 'Server error creating fee' });
  }
};

// @desc    Get all due fees across all students
// @route   GET /api/fees/dues
// @access  Private (Admin, Receptionist)
const getDueFees = async (req, res) => {
  try {
    const dueFees = await Fee.find({ due_amount: { $gt: 0 } })
      .populate('lead_id', 'full_name mobile_number email city status')
      .populate('course_id', 'course_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: dueFees.length,
      data: dueFees
    });
  } catch (error) {
    console.error('Error fetching due fees:', error);
    res.status(500).json({ success: false, message: 'Server error fetching due fees' });
  }
};

// @desc    Get fee details for a specific student/lead
// @route   GET /api/fees/student/:leadId
// @access  Private (Admin, Receptionist)
const getFeesByStudent = async (req, res) => {
  try {
    const { leadId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(leadId)) {
      return res.status(400).json({ success: false, message: 'Invalid lead ID format' });
    }

    const fees = await Fee.find({ lead_id: leadId })
      .populate('course_id', 'course_name');

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (error) {
    console.error('Error fetching student fees:', error);
    res.status(500).json({ success: false, message: 'Server error fetching student fees' });
  }
};

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private (Admin, Receptionist)
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate('lead_id', 'full_name last_name email mobile_number status')
      .populate('student_id', 'personal_info.first_name personal_info.last_name contact_info.email enrollment_number')
      .populate('course_id', 'name level')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (error) {
    console.error('Error fetching all fees:', error);
    res.status(500).json({ success: false, message: 'Server error fetching fees' });
  }
};

module.exports = {
  createFee,
  getDueFees,
  getFeesByStudent,
  getFees
};
