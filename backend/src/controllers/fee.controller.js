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
    const { lead_id, course_id, tax_amount } = req.body;

    if (!lead_id || !course_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Verify if Lead and Course actually exist in the database
    const [leadExists, courseExists] = await Promise.all([
      Lead.findById(lead_id),
      Course.findById(course_id)
    ]);

    if (!leadExists) {
      return res.status(404).json({ success: false, message: 'Invalid lead_id: Lead does not exist' });
    }
    if (!courseExists) {
      return res.status(404).json({ success: false, message: 'Invalid course_id: Course does not exist' });
    }
    if (!courseExists.is_active) {
      return res.status(400).json({ success: false, message: 'Cannot assign a fee for an inactive/deleted course' });
    }

    // Calculate the actual total amount. We accept total_amount from frontend since it includes the admission fee.
    // As a basic validation, ensure it's at least the base course fee.
    const base_course_fee = courseExists.fee_structure?.total_fee || 0;
    const total_amount = Math.max(req.body.total_amount || 0, base_course_fee);
    const net_payable = Number(total_amount) + (Number(tax_amount) || 0);

    // Check if Fee already exists for this lead and course
    const existingFee = await Fee.findOne({ lead_id, course_id });
    if (existingFee) {
      // If admission hasn't completed yet (no student_id), update the fee amounts in case frontend calculations changed
      if (!existingFee.student_id) {
        existingFee.total_amount = total_amount;
        existingFee.tax_amount = tax_amount || 0;
        existingFee.net_payable = net_payable;
        await existingFee.save(); // pre-save hook will update due_amount based on existing paid_amount
      }

      return res.status(200).json({
        success: true,
        message: 'Fee structure already exists',
        data: existingFee
      });
    }

    const newFee = await Fee.create({
      lead_id,
      course_id,
      total_amount,
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
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 50;
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { due_amount: { $gt: 0 }, is_deleted: { $ne: true } } },
      {
        $lookup: {
          from: 'leads',
          localField: 'lead_id',
          foreignField: '_id',
          as: 'lead'
        }
      },
      { $unwind: { path: '$lead', preserveNullAndEmptyArrays: false } },
      { $match: { 'lead.status': 'Enrolled' } },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          lead_id: {
            _id: '$lead._id',
            full_name: '$lead.full_name',
            mobile_number: '$lead.mobile_number',
            email: '$lead.email',
            city: '$lead.city',
            status: '$lead.status'
          },
          course_id: {
            _id: '$course._id',
            course_name: '$course.course_name'
          },
          total_amount: 1,
          tax_amount: 1,
          net_payable: 1,
          paid_amount: 1,
          due_amount: 1,
          status: 1,
          created_at: 1,
          updated_at: 1
        }
      }
    ];

    const dueFees = await Fee.aggregate(pipeline);

    const countPipeline = [
      { $match: { due_amount: { $gt: 0 }, is_deleted: { $ne: true } } },
      {
        $lookup: {
          from: 'leads',
          localField: 'lead_id',
          foreignField: '_id',
          as: 'lead'
        }
      },
      { $unwind: { path: '$lead', preserveNullAndEmptyArrays: false } },
      { $match: { 'lead.status': 'Enrolled' } },
      { $count: 'total' }
    ];
    
    const countResult = await Fee.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    res.status(200).json({
      success: true,
      count: dueFees.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
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

    const fees = await Fee.find({
      $or: [{ lead_id: leadId }, { student_id: leadId }],
      is_deleted: { $ne: true }
    }).populate('course_id', 'course_name');

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
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 50;
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    const fees = await Fee.find({ is_deleted: { $ne: true } })
      .populate('lead_id', 'full_name last_name email mobile_number status')
      .populate('student_id', 'personal_info.first_name personal_info.last_name contact_info.email enrollment_number')
      .populate('course_id', 'name level')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fee.countDocuments({ is_deleted: { $ne: true } });

    res.status(200).json({
      success: true,
      count: fees.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
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
