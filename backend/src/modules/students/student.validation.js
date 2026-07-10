const { z } = require('zod');

const studentValidationSchema = z.object({
  personal_info: z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(['Male', 'Female', 'Other']),
    blood_group: z.string().optional(),
    category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']),
    nationality: z.string().min(1, "Nationality is required"),
    aadhaar_number: z.string().optional(),
    marital_status: z.string().optional(),
    identification_mark_1: z.string().optional(),
    identification_mark_2: z.string().optional(),
    disability_status: z.enum(['Yes', 'No']).optional(),
    disability_description: z.string().optional()
  }),
  contact_info: z.object({
    email: z.string().email("Invalid email format"),
    mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    alternate_mobile: z.string().optional(),
    personal_email: z.string().email("Invalid email").optional().or(z.literal('')),
    preferred_language: z.string().optional()
  }),
  addresses: z.object({
    permanent: z.object({
      house_no: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pin_code: z.string().optional()
    }).optional(),
    current: z.object({
      same_as_permanent: z.boolean().optional(),
      house_no: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pin_code: z.string().optional()
    }).optional()
  }).optional(),
  emergency_contact: z.object({
    name: z.string().min(1, "Emergency Contact Name is required"),
    relationship: z.string().min(1, "Emergency Relationship is required"),
    mobile_number: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
  }),
  academic_history: z.any().optional(),
  media: z.object({
    photo_url: z.string().optional(),
    signature_url: z.string().optional()
  }).optional(),
  
  parent_id: z.string().optional(),
  department_id: z.string().optional(),
  program_id: z.string().optional(),
  admission_year: z.string().min(1, "Admission Year is required"),
  current_semester: z.string().optional(),
  section: z.string().optional(),
  mode_of_admission: z.string().optional()
});

module.exports = {
  studentValidationSchema
};
