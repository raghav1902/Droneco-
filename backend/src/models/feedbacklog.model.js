const mongoose = require('mongoose');

const FeedbackLogSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  staff_id: {
    type: String, // Or ObjectId if User model exists and we use it
    required: true
  },
  feedback_text: {
    type: String,
    required: true
  },
  next_follow_up_date: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for fast querying by lead
FeedbackLogSchema.index({ lead_id: 1 });

FeedbackLogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('FeedbackLog', FeedbackLogSchema);
