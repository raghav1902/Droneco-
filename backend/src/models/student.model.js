const mongoose = require('mongoose');
require('../models/counters.model'); // Ensure Counter model is registered

const StudentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: If student has a login
  student_id: { type: String, unique: true, sparse: true }, // Internal ID
  enrollment_number: { type: String }, // Auto-generated ID (EN-YYYY-XXXX)
  roll_number: { type: String },
  
  // Basic Info
  personal_info: {
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    blood_group: { type: String },
    category: { type: String, required: true, enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'] },
    nationality: { type: String, required: true },
    aadhaar_number: { type: String },
    marital_status: { type: String },
    identification_mark_1: { type: String },
    identification_mark_2: { type: String },
    disability_status: { type: String, enum: ['Yes', 'No'] },
    disability_description: { type: String }
  },

  // Contact Info
  contact_info: {
    email: { type: String, required: true }, // Primary communication email
    mobile_number: { type: String, required: true }, // Primary SMS number
    alternate_mobile: { type: String },
    personal_email: { type: String },
    preferred_language: { type: String }
  },

  // Addresses
  addresses: {
    permanent: {
      house_no: String,
      street: String,
      city: String,
      district: String,
      state: String,
      country: { type: String, default: 'India' },
      pin_code: String
    },
    current: {
      same_as_permanent: { type: Boolean, default: false },
      house_no: String,
      street: String,
      city: String,
      district: String,
      state: String,
      country: String,
      pin_code: String
    }
  },

  // Academic History
  academic_history: {
    previous_qualification: {
      school_college_name: String,
      board_university: String,
      passing_year: String,
      percentage_cgpa: String,
      roll_number: String
    },
    tenth_details: {
      percentage: String,
      board: String,
      passing_year: String
    },
    twelfth_details: {
      percentage: String,
      board: String,
      passing_year: String
    }
  },

  // Media
  media: {
    photo_url: { type: String },
    signature_url: { type: String }
  },

  // Emergency Contact
  emergency_contact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    mobile_number: { type: String, required: true }
  },

  // Relationships (Foreign Keys)
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  
  // Current Enrollment Status
  admission_year: { type: String, required: true },
  current_semester: { type: String },
  section: { type: String },
  mode_of_admission: { type: String },
  
  status: {
    type: String,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED', 'ALUMNI', 'DROPOUT']
  },
  
  is_deleted: { type: Boolean, default: false, index: true },
  deleted_at: { type: Date, default: null }
}, { timestamps: true });

// Pre-find hook to filter out soft-deleted documents
StudentSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

// Indexes for fast querying
StudentSchema.index({ enrollment_number: 1 }, { unique: true, sparse: true });
StudentSchema.index({ 'contact_info.email': 1 });
StudentSchema.index({ 'contact_info.mobile_number': 1 });
StudentSchema.index({ department_id: 1, current_semester: 1 });
StudentSchema.index({ 'personal_info.first_name': 1, 'personal_info.last_name': 1 });

// Helper function for Title Case
const toTitleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

StudentSchema.pre('save', async function (next) {
  const deepTrim = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    if (obj instanceof Map) {
      for (const [k, v] of obj) {
        if (typeof v === 'string') obj.set(k, v.trim());
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach(item => deepTrim(item));
      return;
    }
    for (let key of Object.keys(obj)) {
      if (key.startsWith('_') || key.startsWith('$')) continue;
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        deepTrim(obj[key]);
      }
    }
  };
  
  deepTrim(this._doc);

  // Auto format names to Title Case
  if (this.personal_info) {
    if (this.personal_info.first_name) this.personal_info.first_name = toTitleCase(this.personal_info.first_name);
    if (this.personal_info.middle_name) this.personal_info.middle_name = toTitleCase(this.personal_info.middle_name);
    if (this.personal_info.last_name) this.personal_info.last_name = toTitleCase(this.personal_info.last_name);
    if (this.personal_info.identification_mark_1) this.personal_info.identification_mark_1 = toTitleCase(this.personal_info.identification_mark_1);
    if (this.personal_info.identification_mark_2) this.personal_info.identification_mark_2 = toTitleCase(this.personal_info.identification_mark_2);
  }

  if (this.emergency_contact?.name) {
    this.emergency_contact.name = toTitleCase(this.emergency_contact.name);
  }
  
  if (this.contact_info?.preferred_language) {
    this.contact_info.preferred_language = toTitleCase(this.contact_info.preferred_language);
  }

  // Auto-generate enrollment number if not exists using Counter collection
  if (this.isNew && !this.enrollment_number) {
    try {
      const Counter = mongoose.model('Counter');
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'enrollment_number' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const year = this.admission_year || new Date().getFullYear();
      const paddedSeq = String(counter.seq).padStart(4, '0'); // e.g., 0001
      this.enrollment_number = `EN-${year}-${paddedSeq}`;
    } catch (err) {
      return next(err);
    }
  }

  next();
});

module.exports = mongoose.model('Student', StudentSchema);
