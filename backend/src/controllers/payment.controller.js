/**
 * @file paymentController.js
 * @description Controller for recording and tracking fee payments.
 */

const Payment = require('../models/payment.model');
const Fee = require('../models/fee.model');

// @desc    Record a new payment
// @route   POST /api/payments
// @access  Private (Admin, Receptionist)
const createPayment = async (req, res) => {
  try {
    const { fee_id, amount_paid, payment_method, late_fee, discount_applied, remarks } = req.body;

    if (!fee_id || !amount_paid || !payment_method) {
      return res.status(400).json({ success: false, message: 'Please provide fee_id, amount_paid, and payment_method' });
    }

    const fee = await Fee.findById(fee_id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    // Generate receipt number (DRN-RCPT-YYYY-RAND)
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const receipt_number = `DRN-RCPT-${year}-${rand}`;

    const newPayment = await Payment.create({
      fee_id,
      amount_paid,
      payment_method,
      late_fee: late_fee || 0,
      discount_applied: discount_applied || 0,
      receipt_number,
      collected_by: req.user.id,
      remarks: remarks || ''
    });

    // Update the parent Fee record's paid amount and discount
    fee.paid_amount = Number(fee.paid_amount || 0) + Number(amount_paid || 0);
    
    if (discount_applied) {
      fee.discount_amount = Number(fee.discount_amount || 0) + Number(discount_applied);
      fee.net_payable = Math.max(0, Number(fee.net_payable || 0) - Number(discount_applied));
    }

    // If there is a late fee, it technically increases the net_payable OR we just treat it as an isolated charge
    // For simplicity, we assume late fees increase the net payable if they are paid right now
    if (late_fee) {
      fee.net_payable = Number(fee.net_payable || 0) + Number(late_fee || 0);
    }
    
    // The pre('save') hook in Fee.js will automatically recalculate due_amount and status

    await fee.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: newPayment,
      fee: fee
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating payment' });
  }
};

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private (Admin, Receptionist)
const getPayments = async (req, res) => {
  try {
    // Optionally filter by student if lead_id is passed in query
    const { lead_id } = req.query;

    let query = {};
    if (lead_id) {
      if (!/^[0-9a-fA-F]{24}$/.test(lead_id)) {
        return res.status(400).json({ success: false, message: 'Invalid lead ID format' });
      }
      // Find all fees for this lead to filter payments
      const fees = await Fee.find({ lead_id });
      const feeIds = fees.map(f => f._id);
      query.fee_id = { $in: feeIds };
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'fee_id',
        populate: [
          { path: 'lead_id', select: 'full_name mobile_number email' },
          { path: 'course_id', select: 'course_name' }
        ]
      })
      .populate('collected_by', 'name role')
      .sort({ transaction_date: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Server error fetching payments' });
  }
};

module.exports = {
  createPayment,
  getPayments
};
