const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: [true, 'Course name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Course name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, 'Course code cannot be more than 20 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  duration_months: {
    type: Number,
    required: [true, 'Duration in months is required'],
    min: [1, 'Duration must be at least 1 month'],
    max: [60, 'Duration cannot exceed 60 months']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  fee_structure: {
    total_fee: { type: Number, default: 0 },
    installments_allowed: { type: Boolean, default: false }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

CourseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Course', CourseSchema);
