const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_text: {
    type: String,
    required: [true, 'Please add a question text'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'dropdown', 'checkbox', 'radio', 'textarea'],
    required: [true, 'Please specify the question type'],
    default: 'text'
  },
  options: {
    type: [String],
    default: []
  },
  is_required: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Add toJSON transform to map _id to id and remove __v
questionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Question', questionSchema);
