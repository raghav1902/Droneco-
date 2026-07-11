import { z } from 'zod';

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

const phoneRegex = /^\d{10}$/;

export const authLoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

export const createLeadSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  mobile_number: z.string().optional(),
  city: z.string().optional(),
  filler_type: z.enum(['student', 'guardian']),
  
  // Basic Info extensions
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  blood_group: z.string().optional(),
  nationality: z.string().optional(),
  category: z.string().optional(),
  religion: z.string().optional(),
  aadhaar_number: z.string().optional(),

  // Personal Info
  marital_status: z.string().optional(),
  identification_mark_1: z.string().optional(),
  identification_mark_2: z.string().optional(),
  disability_status: z.enum(['Yes', 'No']).optional(),
  disability_description: z.string().optional(),

  // Media
  photo_url: z.string().optional(),
  signature_url: z.string().optional(),

  // Communication Info
  preferred_language: z.string().optional(),
  alternate_mobile: z.string().optional(),
  personal_email: z.string().optional(),

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
  father: createParentSchema('Father').optional(),
  mother: createParentSchema('Mother').optional(),
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
    name: z.string().optional(),
    relationship: z.string().optional(),
    mobile_number: z.string().optional()
  }).optional(),

  // Course Details
  interested_course_id: z.string().optional(),
  admission_year: z.string().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
  section: z.string().optional(),
  roll_number: z.string().optional(),
  student_id: z.string().optional(),
  mode_of_admission: z.string().optional()
});

export const step1Schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  mobile_number: z.string().optional().or(z.literal('')),
  city: z.string().min(1, "City is required"),
  filler_type: z.enum(['student', 'guardian']),
  guardian: z.object({
    first_name: z.string().optional(),
    relationship: z.string().optional(),
    mobile_number: z.string().optional().or(z.literal(''))
  }).optional()
}).superRefine((data, ctx) => {
  if (data.filler_type === 'guardian') {
    if (!data.guardian || !data.guardian.first_name) {
      ctx.addIssue({ path: ['guardian', 'first_name'], message: 'Guardian first name is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian || !data.guardian.relationship) {
      ctx.addIssue({ path: ['guardian', 'relationship'], message: 'Relationship is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian || !data.guardian.mobile_number || !/^\d{10}$/.test(data.guardian.mobile_number)) {
      ctx.addIssue({ path: ['guardian', 'mobile_number'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
  } else {
    if (!data.mobile_number || !/^\d{10}$/.test(data.mobile_number)) {
      ctx.addIssue({ path: ['mobile_number'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
  }
});

export const addFeedbackSchema = z.object({
  feedback_text: z.string().min(1, "Remarks are required"),
  next_follow_up_date: z.string().optional().nullable()
});

export const courseSchema = z.object({
  course_name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string().optional(),
  duration_months: z.number({ invalid_type_error: "Must be a number" }).positive("Duration must be a positive number"),
  is_active: z.boolean().optional()
});

export const createQuestionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  step_number: z.coerce.number().int().min(1, "Order must be at least 1"),
  field_type: z.enum(['text', 'dropdown', 'radio', 'checkbox']),
  optionsString: z.string().optional(),
  is_required: z.boolean().optional()
});

export const discountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  type: z.enum(['percentage', 'fixed']),
  value: z.number({ invalid_type_error: "Must be a number" }).positive("Value must be a positive number"),
  max_cap: z.number({ invalid_type_error: "Must be a number" }).optional().nullable(),
  is_active: z.boolean().optional()
});

export const collectFeeSchema = z.object({
  fee_id: z.string().optional(),
  amount_paid: z.number({ invalid_type_error: "Must be a number" }).positive("Amount must be a positive number"),
  payment_method: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']),
  remarks: z.string().optional()
});

export const admissionSchema = z.object({
  lead_id: z.string().min(1, "Lead ID is required"),
  course_id: z.string().min(1, "Course ID is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional()
});

export const settingsSchema = z.object({
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

export const validateForm = (schema, data) => {
  try {
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach(err => {
        const pathKey = err.path.join('.');
        if (!errors[pathKey]) {
          errors[pathKey] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: "An unexpected error occurred" } };
  }
};
