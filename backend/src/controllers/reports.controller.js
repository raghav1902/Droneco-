/**
 * @file reportsController.js
 * @description Controller for generating financial reports.
 */

const Payment = require('../models/payment.model');
const Fee = require('../models/fee.model');

// @desc    Get admin reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
const getReports = async (req, res) => {
  try {
    // 1. Daily Collection Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const payments = await Payment.find({
      transaction_date: { $gte: sevenDaysAgo }
    });

    const dailyCollectionMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      dailyCollectionMap[dateStr] = 0;
    }

    payments.forEach(p => {
      const dateStr = new Date(p.transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (dailyCollectionMap[dateStr] !== undefined) {
        dailyCollectionMap[dateStr] += p.amount_paid;
      }
    });

    const dailyCollection = Object.keys(dailyCollectionMap).map(name => ({
      name,
      amount: dailyCollectionMap[name]
    }));

    // 2. Payment Method Distribution
    const allPayments = await Payment.find();
    const methodMap = {};
    allPayments.forEach(p => {
      const method = p.payment_method || 'Other';
      if (!methodMap[method]) methodMap[method] = 0;
      methodMap[method] += p.amount_paid;
    });

    const paymentMethods = Object.keys(methodMap).map(name => ({
      name,
      value: methodMap[name]
    }));

    // 3. Top 5 Pending Fees
    const pendingFeesRaw = await Fee.find({ due_amount: { $gt: 0 } })
      .sort({ due_amount: -1 })
      .limit(5)
      .populate('lead_id', 'full_name')
      .populate('course_id', 'course_name');

    const pendingFees = pendingFeesRaw.map(fee => ({
      id: fee._id,
      name: fee.lead_id ? fee.lead_id.full_name : 'Unknown Student',
      course: fee.course_id ? fee.course_id.course_name : 'Unknown Course',
      total: fee.net_payable,
      paid: fee.paid_amount,
      pending: fee.due_amount
    }));

    // 4. Totals for Fee Dashboard
    const totalFeesAgg = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount_paid' } } }]);
    const totalPendingAgg = await Fee.aggregate([{ $group: { _id: null, total: { $sum: '$due_amount' } } }]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCollectionAgg = await Payment.aggregate([
      { $match: { transaction_date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount_paid' } } }
    ]);

    const Lead = require('../models/lead.model');
    const totalStudents = await Lead.countDocuments({ status: 'Enrolled' });

    // 5. Recent Transactions
    const recentTxnRaw = await Payment.find()
      .sort({ transaction_date: -1 })
      .limit(5)
      .populate({
        path: 'fee_id',
        populate: { path: 'lead_id', select: 'full_name' }
      });

    const recentTransactions = recentTxnRaw.map(txn => ({
      id: txn._id,
      studentName: txn.fee_id && txn.fee_id.lead_id ? txn.fee_id.lead_id.full_name : 'Unknown Student',
      amount: txn.amount_paid,
      method: txn.payment_method || 'Other',
      status: 'Success' // Payments in DB are successful
    }));

    // 6. Monthly Revenue Trend (for Fee Dashboard)
    const currentYear = new Date().getFullYear();
    const monthlyAgg = await Payment.aggregate([
      {
        $match: {
          transaction_date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      { $group: { _id: { $month: "$transaction_date" }, collected: { $sum: "$amount_paid" } } }
    ]);

    // Create month names array
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = monthNames.map((name, index) => {
      const monthData = monthlyAgg.find(m => m._id === index + 1);
      return {
        name,
        collected: monthData ? monthData.collected : 0,
        pending: 0 // Ideally this would calculate historical pending, but 0 is okay for trend
      };
    });

    res.status(200).json({
      success: true,
      data: {
        dailyCollection,
        paymentMethods,
        pendingFees,
        summary: {
          totalCollected: totalFeesAgg[0] ? totalFeesAgg[0].total : 0,
          totalPending: totalPendingAgg[0] ? totalPendingAgg[0].total : 0,
          todaysCollection: todayCollectionAgg[0] ? todayCollectionAgg[0].total : 0,
          totalStudents
        },
        recentTransactions,
        revenueTrend
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reports' });
  }
};

module.exports = {
  getReports
};
