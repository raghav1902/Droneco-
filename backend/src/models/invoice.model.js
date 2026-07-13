const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fee_type: { 
    type: String, 
    required: true,
    enum: ['Admission Fee', 'Tuition Fee', 'Exam Fee', 'Library Fee', 'Hostel Fee', 'Transport Fee', 'Other']
  },
  base_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  total_amount_due: { type: Number, required: true },
  due_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  },
  remarks: { type: String },
  deleted_at: { type: Date, default: null }
}, { timestamps: true });

// Pre-save hook to calculate total amount due
InvoiceSchema.pre('save', function(next) {
  if (this.isModified('base_amount') || this.isModified('discount_amount') || this.isModified('tax_amount')) {
    this.total_amount_due = (this.base_amount - this.discount_amount) + this.tax_amount;
  }
  
  if (this.total_amount_due < 0) {
    this.total_amount_due = 0;
  }
  
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
