const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  // --- Step 1: Basic Info (Combined) ---
  filler_type: {
    type: String,
    default: 'student',
    enum: ['student', 'guardian']
  },
  full_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  blood_group: { type: String },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'] },
  nationality: { type: String },
  aadhaar_number: { type: String },
  email: { type: String, required: false },
  mobile_number: { type: String, required: false },
  city: { type: String, required: true }, // Not explicitly mentioned, but keeping for compatibility
  
  // --- Personal Information ---
  marital_status: { type: String },
  identification_mark_1: { type: String },
  identification_mark_2: { type: String },
  disability_status: { type: String, enum: ['Yes', 'No'] },
  disability_description: { type: String },
  
  // --- Media Information ---
  photo_url: { type: String, required: false },
  signature_url: { type: String, required: false },
  
  // --- Communication Information ---
  preferred_language: { type: String },
  alternate_mobile: { type: String },
  personal_email: { type: String },
  
  // --- Address Details ---
  permanent_address: {
    house_no: String,
    street: String,
    city: String,
    district: String,
    state: String,
    country: String,
    pin_code: String
  },
  current_address: {
    same_as_permanent: { type: Boolean, default: false },
    house_no: String,
    street: String,
    city: String,
    district: String,
    state: String,
    country: String,
    pin_code: String
  },

  // --- Step 2: Course Info (Combined) ---
  qualification: { type: String },
  currentClass: { type: String },
  interested_course_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  },
  interestedCourse: { type: String },
  interestedSubject: { type: String },
  preferredBatch: { type: String },
  learningMode: {
    type: String,
    enum: ['online', 'offline', 'hybrid']
  },

  // --- Parent / Guardian Details ---
  father: {
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String },
    mobile_number: { type: String },
    alt_mobile_number: { type: String },
    email: { type: String },
    occupation: { type: String },
    organization: { type: String },
    annual_income: { type: Number },
    highest_qualification: { type: String }
  },
  mother: {
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String },
    mobile_number: { type: String },
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
  emergency_contact: {
    name: { type: String },
    relationship: { type: String },
    mobile_number: { type: String }
  },

  // --- Academic Details ---
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
  },

  // --- Extended Course Details ---
  admission_year: { type: String },
  department: { type: String },
  branch: { type: String }, // Can be combined with department as per UI
  semester: { type: String },
  section: { type: String },
  enrollment_number: { type: String }, // Auto Generated
  roll_number: { type: String }, // Auto Generated after approval
  student_id: { type: String },
  mode_of_admission: { type: String },

  // --- Step 3: Additional Info (Combined) ---
  queries: { type: String },
  careerGoal: { type: String },
  remarks: { type: String },

  // --- Dynamic Responses (From Controller) ---
  responses: [{
    question_id: String,
    response_value: mongoose.Schema.Types.Mixed
  }],

  // --- Initial Feedback (From Controller) ---
  feedback: {
    rating: { type: Number, default: 5 },
    source: { type: String, default: 'Direct' },
    comments: { type: String, default: '' }
  },

  // --- Metadata (Combined) ---
  status: {
    type: String,
    default: 'New',
    enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled']
  },
  assigned_to_staff_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },

  is_deleted: { type: Boolean, default: false, index: true },
  deleted_at: { type: Date, default: null },

  submitted_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-find hook to filter out soft-deleted documents
LeadSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

// Indexes for fast querying
LeadSchema.index({ email: 1 });
LeadSchema.index({ mobile_number: 1 });
LeadSchema.index({ status: 1 });

// Helper function for Title Case
const toTitleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

LeadSchema.pre('save', function (next) {
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
  if (this.full_name) this.full_name = toTitleCase(this.full_name);
  if (this.middle_name) this.middle_name = toTitleCase(this.middle_name);
  if (this.last_name) this.last_name = toTitleCase(this.last_name);
  
  if (this.father?.first_name) this.father.first_name = toTitleCase(this.father.first_name);
  if (this.father?.middle_name) this.father.middle_name = toTitleCase(this.father.middle_name);
  if (this.father?.last_name) this.father.last_name = toTitleCase(this.father.last_name);

  if (this.mother?.first_name) this.mother.first_name = toTitleCase(this.mother.first_name);
  if (this.mother?.middle_name) this.mother.middle_name = toTitleCase(this.mother.middle_name);
  if (this.mother?.last_name) this.mother.last_name = toTitleCase(this.mother.last_name);

  if (this.guardian?.first_name) this.guardian.first_name = toTitleCase(this.guardian.first_name);
  if (this.guardian?.middle_name) this.guardian.middle_name = toTitleCase(this.guardian.middle_name);
  if (this.guardian?.last_name) this.guardian.last_name = toTitleCase(this.guardian.last_name);
  
  if (this.emergency_contact?.name) this.emergency_contact.name = toTitleCase(this.emergency_contact.name);
  
  // Format marks, status, languages
  if (this.identification_mark_1) this.identification_mark_1 = toTitleCase(this.identification_mark_1);
  if (this.identification_mark_2) this.identification_mark_2 = toTitleCase(this.identification_mark_2);
  if (this.preferred_language) this.preferred_language = toTitleCase(this.preferred_language);
  
  next();
});

LeadSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

LeadSchema.index({ full_name: 1, mobile_number: 1, email: 1 });

module.exports = mongoose.model('Lead', LeadSchema);
