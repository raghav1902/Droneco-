const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const MONGO_URI = 'mongodb://localhost:27017/institute_lead_db';
const BASE_URL = 'http://localhost:5000';
const JWT_SECRET = 'YOUR_JWT_SUPER_SECRET_KEY';

async function runAudit() {
  console.log('--- STARTING BACKEND AUDIT ---');
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[OK] Connected to MongoDB');
  } catch (e) {
    console.error('[FAIL] MongoDB Connection failed:', e.message);
    return;
  }

  const db = mongoose.connection.db;
  const adminRole = await db.collection('roles').findOne({ name: 'Admin' });
  let token = '';
  if (adminRole) {
    const adminUser = await db.collection('users').findOne({ role: adminRole._id });
    if (adminUser) {
      token = jwt.sign({ id: adminUser._id }, JWT_SECRET, { expiresIn: '1h' });
      console.log(`[OK] Generated Admin token for user: ${adminUser.email}`);
    } else {
      console.log('[WARN] No admin user found');
    }
  } else {
    console.log('[WARN] No Admin role found');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/api/auth/me',
    '/api/users',
    '/api/leads',
    '/api/courses',
    '/api/questions',
    '/api/fees',
    '/api/payments',
    '/api/admin/stats',
    '/api/admin/reports',
    '/api/discounts',
    '/api/settings',
    '/api/v2/students'
  ];

  console.log('\n--- TESTING API ENDPOINTS ---');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`, { headers });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        let count = Array.isArray(data.data) ? data.data.length : (data.data ? 1 : 0);
        console.log(`[OK] ${ep} - Status: ${res.status} - Data count: ${count}`);
      } else {
        console.log(`[FAIL] ${ep} - Status: ${res.status} - Error: ${data.message || 'Unknown'}`);
      }
    } catch (e) {
      console.log(`[FAIL] ${ep} - Network Error: ${e.message}`);
    }
  }

  console.log('\n--- CHECKING DATA INTEGRITY ---');
  
  const students = await db.collection('students').find().toArray();
  console.log(`Checking ${students.length} students...`);
  let orphanedStudents = 0;
  for (const s of students) {
    if (s.lead_id) {
      const lead = await db.collection('leads').findOne({ _id: s.lead_id });
      if (!lead) orphanedStudents++;
    }
  }
  if (orphanedStudents > 0) console.log(`[FAIL] Found ${orphanedStudents} orphaned student records (missing lead).`);
  else console.log('[OK] No orphaned student records.');

  try {
    const leadsRes = await fetch(`${BASE_URL}/api/leads`, { headers });
    const leadsData = await leadsRes.json();
    if (leadsData.success && Array.isArray(leadsData.data)) {
        let badCourses = 0;
        leadsData.data.forEach(l => {
            if (l.course && typeof l.course === 'string' && l.course.match(/^[0-9a-fA-F]{24}$/)) {
                badCourses++;
            }
        });
        if (badCourses > 0) console.log(`[FAIL] ${badCourses} Leads have raw ObjectId for course instead of populated object.`);
        else console.log('[OK] Course names resolve correctly in Leads API.');
    }
  } catch (e) {}

  let studentsWithoutFees = 0;
  for (const s of students) {
      const fee = await db.collection('fees').findOne({ student: s._id });
      if (!fee) studentsWithoutFees++;
  }
  if (studentsWithoutFees > 0) console.log(`[WARN] ${studentsWithoutFees} students have no associated Fee records.`);
  else console.log('[OK] All students have Fee records.');

  console.log('\n--- AUDIT COMPLETE ---');
  mongoose.disconnect();
}

runAudit();
