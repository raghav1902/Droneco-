const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Admin', 'Receptionist'],
    unique: true
  },
  permissions: [{
    type: String
  }]
});

RoleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Role', RoleSchema);
