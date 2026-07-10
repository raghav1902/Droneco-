const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Computer Science"
  code: { type: String, required: true, unique: true }, // e.g., "CS"
  head_of_department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Trimming & Title Case
DepartmentSchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
