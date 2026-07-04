/**
 * @file store.js
 * @description In-memory data store acting as the database for the coaching institute lead management system.
 */

const crypto = require('crypto');

// Generate unique IDs
const generateId = () => crypto.randomBytes(12).toString('hex');

// Seed Users (Admin and Receptionist)
// In a real DB, passwords would be bcrypt hashed, but for simplicity in this in-memory phase,
// we will store them as plain text or do a direct match. We'll use simple plain-text comparison for ease.
const users = [
  {
    id: 'user_admin_01',
    name: 'Admin Principal',
    email: 'admin@institute.com',
    phone: '+1 987-654-3210',
    profile_photo: '',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    created_at: new Date()
  },
  {
    id: 'user_reception_01',
    name: 'Sarah Jenkins',
    email: 'reception@institute.com',
    phone: '+1 987-654-3210',
    profile_photo: '',
    password: 'reception123',
    role: 'receptionist',
    status: 'active',
    created_at: new Date()
  }
];

// Seed Courses
const courses = [
  {
    id: 'course_01',
    course_name: 'Full Stack Web Development',
    code: 'FSWD',
    description: 'Learn modern web development using HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB.',
    duration_months: 6,
    is_active: true,
    created_at: new Date()
  },
  {
    id: 'course_02',
    course_name: 'Data Science & Artificial Intelligence',
    code: 'DSAI',
    description: 'Master Python, SQL, Machine Learning, Deep Learning, and data visualization tools.',
    duration_months: 8,
    is_active: true,
    created_at: new Date()
  },
  {
    id: 'course_03',
    course_name: 'UI/UX Design Masterclass',
    code: 'UIUX',
    description: 'Learn user research, wireframing, prototyping, and UI design using Figma.',
    duration_months: 4,
    is_active: true,
    created_at: new Date()
  }
];

// Seed Dynamic Questions for Step 2
const questions = [
  {
    id: 'q_01',
    question_text: 'What is your highest educational qualification?',
    step_number: 2,
    field_type: 'dropdown',
    options: ['High School', 'Undergraduate Student', 'Graduate', 'Working Professional'],
    is_required: true,
    is_active: true,
    created_at: new Date()
  },
  {
    id: 'q_02',
    question_text: 'Do you have any prior programming experience?',
    step_number: 2,
    field_type: 'radio',
    options: ['No experience at all', 'Basic (HTML/CSS/JS)', 'Intermediate (Built some projects)', 'Professional'],
    is_required: true,
    is_active: true,
    created_at: new Date()
  },
  {
    id: 'q_03',
    question_text: 'What is your primary goal for joining this course?',
    step_number: 2,
    field_type: 'text',
    options: [],
    is_required: false,
    is_active: true,
    created_at: new Date()
  }
];

// Seed Leads
const leads = [
  {
    id: 'lead_01',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    mobile_number: '9876543210',
    city: 'New Delhi',
    interested_course_id: 'course_01',
    status: 'New', // New, Contacted, Interested, Not Interested, Enrolled
    assigned_to_staff_id: null,
    submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
    responses: [
      { question_id: 'q_01', response_value: 'Undergraduate Student' },
      { question_id: 'q_02', response_value: 'Basic (HTML/CSS/JS)' },
      { question_id: 'q_03', response_value: 'To get a job as a frontend developer.' }
    ],
    feedback: {
      rating: 5,
      source: 'Social Media',
      comments: 'I would like to know about the placement assistance.'
    }
  },
  {
    id: 'lead_02',
    full_name: 'Priya Patel',
    email: 'priya.patel@yahoo.com',
    mobile_number: '9876543211',
    city: 'Mumbai',
    interested_course_id: 'course_02',
    status: 'Contacted',
    assigned_to_staff_id: 'user_reception_01',
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    responses: [
      { question_id: 'q_01', response_value: 'Graduate' },
      { question_id: 'q_02', response_value: 'No experience at all' },
      { question_id: 'q_03', response_value: 'Transitioning from non-tech to tech.' }
    ],
    feedback: {
      rating: 4,
      source: 'Google Search',
      comments: 'Please share the fee details.'
    }
  },
  {
    id: 'lead_03',
    full_name: 'Aravind Swamy',
    email: 'aravind.s@outlook.com',
    mobile_number: '9876543212',
    city: 'Bangalore',
    interested_course_id: 'course_03',
    status: 'Enrolled',
    assigned_to_staff_id: 'user_reception_01',
    submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    responses: [
      { question_id: 'q_01', response_value: 'Working Professional' },
      { question_id: 'q_02', response_value: 'Basic (HTML/CSS/JS)' },
      { question_id: 'q_03', response_value: 'Enhancing my design skills for my current job.' }
    ],
    feedback: {
      rating: 5,
      source: 'Friend Recommendation',
      comments: 'Excited to join!'
    }
  }
];

// Follow-up Logs (Feedback Responses)
const feedbackLogs = [
  {
    id: 'f_log_01',
    lead_id: 'lead_02',
    staff_id: 'user_reception_01',
    feedback_text: 'Called Priya. Discussed course curriculum and fees. She requested a brochure. Emailed details.',
    next_follow_up_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

module.exports = {
  generateId,
  users,
  courses,
  questions,
  leads,
  feedbackLogs
};
