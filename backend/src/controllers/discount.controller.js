/**
 * @file discountController.js
 * @description Controller for managing discount rules.
 */

const DiscountRule = require('../models/discountrule.model');

// @desc    Get all discount rules
// @route   GET /api/discounts
// @access  Private (Admin)
const getDiscounts = async (req, res) => {
  try {
    const discounts = await DiscountRule.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, count: discounts.length, data: discounts });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ success: false, message: 'Server error fetching discounts' });
  }
};

// @desc    Create a new discount rule
// @route   POST /api/discounts
// @access  Private (Admin)
const createDiscount = async (req, res) => {
  try {
    const { name, type, value } = req.body;
    if (!name || !type || value === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const discount = await DiscountRule.create(req.body);
    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    console.error('Error creating discount:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating discount' });
  }
};

// @desc    Update a discount rule
// @route   PUT /api/discounts/:id
// @access  Private (Admin)
const updateDiscount = async (req, res) => {
  try {
    const discount = await DiscountRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!discount) {
      return res.status(404).json({ success: false, message: 'Discount not found' });
    }

    res.status(200).json({ success: true, data: discount });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ success: false, message: 'Server error updating discount' });
  }
};

// @desc    Delete a discount rule
// @route   DELETE /api/discounts/:id
// @access  Private (Admin)
const deleteDiscount = async (req, res) => {
  try {
    const discount = await DiscountRule.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ success: false, message: 'Discount not found' });
    }
    
    discount.is_deleted = true;
    discount.deleted_at = new Date();
    await discount.save();

    res.status(200).json({ success: true, message: 'Discount soft deleted' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ success: false, message: 'Server error deleting discount' });
  }
};

module.exports = {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount
};
