const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  father: {
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    alt_mobile_number: { type: String },
    email: { type: String },
    occupation: { type: String, required: true },
    organization: { type: String },
    annual_income: { type: Number },
    highest_qualification: { type: String }
  },
  mother: {
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    alt_mobile_number: { type: String },
    email: { type: String },
    occupation: { type: String },
    organization: { type: String },
    annual_income: { type: Number },
    highest_qualification: { type: String }
  },
  guardian: {
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String },
    relationship: { type: String },
    mobile_number: { type: String },
    email: { type: String },
    occupation: { type: String },
    address: { type: String }
  },
  primary_contact: {
    type: String,
    enum: ['FATHER', 'MOTHER', 'GUARDIAN'],
    default: 'FATHER'
  },
  children_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

// Helper function for Title Case
const toTitleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

ParentSchema.pre('save', function (next) {
  // Recursively trim string fields
  const deepTrim = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        deepTrim(obj[key]);
      }
    }
  };
  deepTrim(this);

  // Auto format names to Title Case
  const roles = ['father', 'mother', 'guardian'];
  roles.forEach(role => {
    if (this[role]) {
      if (this[role].first_name) this[role].first_name = toTitleCase(this[role].first_name);
      if (this[role].middle_name) this[role].middle_name = toTitleCase(this[role].middle_name);
      if (this[role].last_name) this[role].last_name = toTitleCase(this[role].last_name);
    }
  });

  next();
});

module.exports = mongoose.model('Parent', ParentSchema);
