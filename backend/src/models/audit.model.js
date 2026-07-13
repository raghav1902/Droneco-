const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ip_address: { type: String }
}, { timestamps: true });

AuditLogSchema.index({ user_id: 1, action: 1 });
AuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
