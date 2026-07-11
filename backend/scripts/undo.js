require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../src/modules/students/student.model');
const Parent = require('../src/modules/parents/parent.model');
const Fee = require('../src/modules/finance/fee.model');
const Payment = require('../src/modules/finance/payment.model');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const studentId = '6a528c8a176dcced01b238d8';
  const st = await Student.findById(studentId);
  if (st) {
    await Parent.findByIdAndDelete(st.parent_id);
    await Student.findByIdAndDelete(studentId);
  }
  await Fee.updateMany({ student_id: studentId }, { $set: { student_id: null } });
  await Payment.updateMany({ student_id: studentId }, { $set: { student_id: null } });
  console.log('Undone');
  process.exit(0);
}
run();
