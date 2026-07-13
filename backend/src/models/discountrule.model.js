const mongoose = require('mongoose');

const discountRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Discount name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Percentage', 'Flat'],
    required: [true, 'Discount type is required']
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_deleted: { type: Boolean, default: false, index: true },
  deleted_at: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Pre-find hook to filter out soft-deleted documents
discountRuleSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

discountRuleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('DiscountRule', discountRuleSchema);
