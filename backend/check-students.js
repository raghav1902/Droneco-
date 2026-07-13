const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/institute_lead_db';

async function checkStudents() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    
    const students = await db.collection('students').find().toArray();
    let studentsWithoutFees = [];
    
    for (const s of students) {
      const fee = await db.collection('fees').findOne({ student: s._id });
      if (!fee) studentsWithoutFees.push(s);
    }
    
    console.log(`Found ${studentsWithoutFees.length} students without fees:`);
    studentsWithoutFees.forEach(s => {
      console.log(`- Student ID: ${s._id}, Created At: ${s.createdAt || s.created_at || 'Unknown'}, Name: ${s.personal_info?.first_name} ${s.personal_info?.last_name}`);
    });
    
  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

checkStudents();
