const { z } = require('zod');

// Phone number regex: Exactly 10 digits
const phoneRegex = /^\d{10}$/;

const authLoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

const createParentSchema = (role) => z.object({
  first_name: z.string().min(1, `${role}'s First Name is required`),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, `${role}'s Last Name is required`),
  mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  alt_mobile_number: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  occupation: role === 'Father' ? z.string().min(1, "Father's Occupation is required") : z.string().optional(),
  organization: z.string().optional(),
  annual_income: z.number().optional().or(z.string().regex(/^\d+$/, "Must be numeric").transform(Number).optional()),
  highest_qualification: z.string().optional()
});

const createLeadSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  city: z.string().min(1, "City is required"),
  filler_type: z.enum(['student', 'guardian']),
  
  // Basic Info extensions
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last Name is required"),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender is required' }) }),
  dob: z.string().min(1, "Date of Birth is required"),
  blood_group: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'], { errorMap: () => ({ message: 'Category is required' }) }),
  religion: z.string().optional(),
  aadhaar_number: z.string().optional(),

  // Personal Info
  marital_status: z.string().optional(),
  identification_mark_1: z.string().optional(),
  identification_mark_2: z.string().optional(),
  disability_status: z.enum(['Yes', 'No']).optional(),
  disability_description: z.string().optional(),

  // Media
  photo_url: z.string().min(1, "Photograph is required"),
  signature_url: z.string().min(1, "Signature is required"),

  // Communication Info
  preferred_language: z.string().optional(),
  alternate_mobile: z.string().optional(),
  personal_email: z.string().email("Invalid email").optional().or(z.literal('')),

  // Addresses
  permanent_address: z.object({
    house_no: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pin_code: z.string().optional()
  }).optional(),
  current_address: z.object({
    same_as_permanent: z.boolean().optional(),
    house_no: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pin_code: z.string().optional()
  }).optional(),

  // Academic Details
  previous_qualification: z.object({
    school_college_name: z.string().optional(),
    board_university: z.string().optional(),
    passing_year: z.string().optional(),
    percentage_cgpa: z.string().optional(),
    roll_number: z.string().optional()
  }).optional(),
  tenth_details: z.object({
    percentage: z.string().optional(),
    board: z.string().optional(),
    passing_year: z.string().optional()
  }).optional(),
  twelfth_details: z.object({
    percentage: z.string().optional(),
    board: z.string().optional(),
    passing_year: z.string().optional()
  }).optional(),

  // Parent / Guardian / Emergency
  father: createParentSchema('Father'),
  mother: createParentSchema('Mother'),
  guardian: z.object({
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    relationship: z.string().optional(),
    mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits").optional().or(z.literal('')),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    occupation: z.string().optional(),
    address: z.string().optional()
  }).optional(),
  emergency_contact: z.object({
    name: z.string().min(1, "Emergency Contact Name is required"),
    relationship: z.string().min(1, "Emergency Relationship is required"),
    mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
  }),

  // Course Details
  interested_course_id: z.string().optional(),
  admission_year: z.string().min(1, "Admission Year is required"),
  department: z.string().min(1, "Department is required"),
  branch: z.string().optional(),
  semester: z.string().min(1, "Semester is required"),
  section: z.string().optional(),
  roll_number: z.string().optional(),
  student_id: z.string().optional(),
  mode_of_admission: z.string().optional(),

  responses: z.array(z.object({
    question_id: z.string(),
    response_value: z.string()
  })).optional()
}).superRefine((data, ctx) => {
  if (data.filler_type === 'guardian') {
    if (!data.guardian || !data.guardian.first_name) {
      ctx.addIssue({ path: ['guardian', 'first_name'], message: 'Guardian first name is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian || !data.guardian.relationship) {
      ctx.addIssue({ path: ['guardian', 'relationship'], message: 'Relationship is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian || !data.guardian.mobile_number || !phoneRegex.test(data.guardian.mobile_number)) {
      ctx.addIssue({ path: ['guardian', 'mobile_number'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
    if (!data.full_name) {
      ctx.addIssue({ path: ['full_name'], message: "Student's full name is required", code: z.ZodIssueCode.custom });
    }
  } else {
    if (!data.mobile_number || !phoneRegex.test(data.mobile_number)) {
      ctx.addIssue({ path: ['mobile_number'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
  }
});

const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Interested', 'Not Interested', 'Approved', 'Enrolled'], { errorMap: () => ({ message: 'Invalid status' }) })
});

const addFeedbackSchema = z.object({
  feedback_text: z.string().min(1, "Feedback text is required"),
  next_follow_up_date: z.string().optional().nullable()
});

const courseSchema = z.object({
  course_name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string().optional(),
  duration_months: z.number().positive("Duration must be a positive number"),
  is_active: z.boolean().optional()
});

const discountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive("Value must be a positive number"),
  max_cap: z.number().optional().nullable(),
  is_active: z.boolean().optional()
});

const collectFeeSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  amount: z.number().positive("Amount must be a positive number"),
  payment_method: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']),
  remarks: z.string().optional()
});

const settingsSchema = z.object({
  institute: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    address: z.string().optional(),
    contact: z.string().optional(),
    email: z.string().email("Invalid email format").optional().or(z.literal(''))
  }).optional(),
  fee: z.object({
    defaultLateFee: z.number().min(0).optional(),
    lateFeeGraceDays: z.number().min(0).optional(),
    admissionFee: z.number().min(0).optional()
  }).optional(),
  receipt: z.object({
    prefix: z.string().optional(),
    header: z.string().optional(),
    footerMessage: z.string().optional(),
    showLogo: z.boolean().optional()
  }).optional()
});

const admissionSchema = z.object({
  lead_id: z.string().min(1, "Lead ID is required"),
  course_id: z.string().min(1, "Course ID is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional()
});

const createQuestionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  type: z.enum(['text', 'dropdown', 'radio', 'checkbox']),
  options: z.array(z.string()).optional(),
  is_required: z.boolean().optional()
});

module.exports = {
  authLoginSchema,
  changePasswordSchema,
  createLeadSchema,
  updateLeadStatusSchema,
  addFeedbackSchema,
  courseSchema,
  discountSchema,
  collectFeeSchema,
  settingsSchema,
  admissionSchema,
  createQuestionSchema
};
