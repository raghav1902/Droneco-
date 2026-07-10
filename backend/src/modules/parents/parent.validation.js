const { z } = require('zod');

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

const parentValidationSchema = z.object({
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
  primary_contact: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']).optional()
});

module.exports = {
  parentValidationSchema
};
