const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Please provide the lead ID']
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please provide the course ID']
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  discount_amount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  tax_amount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  net_payable: {
    type: Number,
    required: [true, 'Net payable amount is required'],
    min: [0, 'Net payable cannot be negative']
  },
  paid_amount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  due_amount: {
    type: Number,
    required: true,
    min: [0, 'Due amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Update status based on paid/due amount before saving
feeSchema.pre('save', function (next) {
  if (this.paid_amount >= this.net_payable) {
    this.status = 'Paid';
    this.due_amount = 0;
  } else if (this.paid_amount > 0) {
    this.status = 'Partial';
    this.due_amount = this.net_payable - this.paid_amount;
  } else {
    this.status = 'Pending';
    this.due_amount = this.net_payable;
  }
  next();
});

// Add toJSON transform to map _id to id and remove __v
feeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Fee', feeSchema);
