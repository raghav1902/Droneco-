const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  fee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee',
    required: [true, 'Please provide the associated Fee ID']
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  amount_paid: {
    type: Number,
    required: [true, 'Please specify the amount paid'],
    min: [1, 'Payment amount must be greater than 0']
  },
  payment_method: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'],
    default: 'SUCCESS'
  },
  transaction_id: {
    type: String,
    trim: true,
    default: ''
  },
  late_fee: {
    type: Number,
    default: 0,
    min: [0, 'Late fee cannot be negative']
  },
  discount_applied: {
    type: Number,
    default: 0,
    min: [0, 'Discount applied cannot be negative']
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  transaction_date: {
    type: Date,
    default: Date.now
  },
  receipt_number: {
    type: String,
    required: [true, 'Receipt number is required'],
    unique: true,
    trim: true
  },
  collected_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  },
  is_deleted: { type: Boolean, default: false, index: true },
  deleted_at: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Pre-find hook to filter out soft-deleted documents
paymentSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

// Add toJSON transform to map _id to id and remove __v
paymentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
