const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "B.Tech Computer Science"
  code: { type: String, required: true, unique: true }, // e.g., "BTECH-CS"
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  duration_years: { type: Number, required: true },
  duration_semesters: { type: Number, required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Trimming & Formatting
ProgramSchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Program', ProgramSchema);
