/**
 * @file paymentController.js
 * @description Controller for recording and tracking fee payments.
 */

const Payment = require('../models/payment.model');
const Fee = require('../models/fee.model');
const mongoose = require('mongoose');
const { logAudit } = require('../utils/auditLogger');

// @desc    Record a new payment
// @route   POST /api/payments
// @access  Private (Admin, Receptionist)
const createPayment = async (req, res) => {
  try {
    const { fee_id, amount_paid, payment_method, late_fee, remarks } = req.body;

    if (!fee_id || amount_paid === undefined || !payment_method) {
      return res.status(400).json({ success: false, message: 'Please provide fee_id, amount_paid, and payment_method' });
    }

    if (Number(amount_paid) <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    if (late_fee !== undefined && Number(late_fee) < 0) {
      return res.status(400).json({ success: false, message: 'Late fee cannot be negative' });
    }

    // Generate receipt number (DRN-RCPT-YYYY-RAND)
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const receipt_number = `DRN-RCPT-${year}-${rand}`;

    let newPayment;
    let updatedFee;

    try {
      const fee = await Fee.findById(fee_id);
      if (!fee) {
        throw new Error('Fee record not found');
      }

      if (amount_paid > fee.due_amount) {
        throw new Error(`Payment amount (₹${amount_paid}) exceeds the due amount (₹${fee.due_amount})`);
      }

      const newPaymentArray = await Payment.create([{
        fee_id,
        amount_paid,
        payment_method,
        late_fee: late_fee || 0,
        receipt_number,
        collected_by: req.user.id,
        remarks: remarks || ''
      }]);
      
      newPayment = newPaymentArray[0];

      // Update the parent Fee record's paid amount
      fee.paid_amount = Number(fee.paid_amount || 0) + Number(amount_paid || 0);

      // If there is a late fee, it technically increases the net_payable
      if (late_fee) {
        fee.net_payable = Number(fee.net_payable || 0) + Number(late_fee || 0);
      }
      
      updatedFee = await fee.save();
      
      // Log the financial transaction outside the session
      await logAudit(
        req.user.id, 
        'Payment Collection', 
        `Collected ₹${amount_paid} via ${payment_method} for Receipt ${receipt_number}`, 
        req.ip
      );
    } catch (transactionError) {
      throw transactionError; // Will be caught by the outer catch block
    }

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: newPayment,
      fee: updatedFee
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    require('fs').appendFileSync('error_debug.log', error.stack + '\n');
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.message && (error.message.includes('exceeds the due amount') || error.message === 'Fee record not found')) {
      return res.status(400).json({ success: false, message: error.message });
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
      // Find all fees for this lead/student to filter payments
      const fees = await Fee.find({
        $or: [{ lead_id }, { student_id: lead_id }]
      });
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

// @desc    Update payment status (e.g. mark as FAILED or REFUNDED)
// @route   PATCH /api/payments/:id/status
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status === status) {
      return res.status(400).json({ success: false, message: `Payment is already ${status}` });
    }

    const oldStatus = payment.status;
    const fee = await Fee.findById(payment.fee_id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Associated Fee record not found' });
    }

    payment.status = status;

    // Logic to revert fee totals if a payment is marked as FAILED or REFUNDED
    if (oldStatus === 'SUCCESS' && (status === 'FAILED' || status === 'REFUNDED')) {
      fee.paid_amount = Math.max(0, Number(fee.paid_amount || 0) - Number(payment.amount_paid || 0));
    } else if ((oldStatus === 'FAILED' || oldStatus === 'REFUNDED' || oldStatus === 'PENDING') && status === 'SUCCESS') {
      fee.paid_amount = Number(fee.paid_amount || 0) + Number(payment.amount_paid || 0);
    }

    await payment.save();
    await fee.save();
    
    // Log status change
    await logAudit(
      req.user.id, 
      'Payment Status Update', 
      `Updated payment ${id} status from ${oldStatus} to ${status}`, 
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}`,
      data: payment
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Server error updating payment status' });
  }
};

module.exports = {
  createPayment,
  getPayments,
  updatePaymentStatus
};
