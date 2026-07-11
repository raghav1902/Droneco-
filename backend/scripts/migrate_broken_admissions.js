require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../src/modules/leads/lead.model');
const Student = require('../src/modules/students/student.model');
const Parent = require('../src/modules/parents/parent.model');
const Fee = require('../src/modules/finance/fee.model');
const Payment = require('../src/modules/finance/payment.model');
const Counter = require('../src/modules/core/counters.model');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // 1. Find orphaned fees (where student_id is null)
    const orphanedFees = await Fee.find({ student_id: null });
    console.log(`Found ${orphanedFees.length} orphaned fees`);

    const leadIds = [...new Set(orphanedFees.map(f => f.lead_id.toString()))];
    
    for (const leadId of leadIds) {
      console.log(`Processing lead ${leadId}`);
      const lead = await Lead.findById(leadId);
      if (!lead) {
        console.log(`Lead ${leadId} not found`);
        continue;
      }

      const leadObj = lead.toObject();

      // Create Parent
      const parentData = {
        father: leadObj.father,
        mother: leadObj.mother,
        guardian: leadObj.guardian,
        primary_contact: 'FATHER'
      };
      const newParent = await Parent.create(parentData);
      const parentId = newParent._id;

      // Create Student
      const firstName = leadObj.full_name.split(' ')[0];
      const lastName = leadObj.last_name || leadObj.full_name.split(' ').slice(1).join(' ') || 'N/A';

      const studentData = {
        student_id: 'ST-' + leadId,
        personal_info: {
          first_name: firstName,
          middle_name: leadObj.middle_name,
          last_name: lastName,
          dob: leadObj.dob || new Date('2000-01-01'),
          gender: leadObj.gender || 'Male',
          blood_group: leadObj.blood_group,
          category: leadObj.category || 'General',
          nationality: leadObj.nationality || 'Indian',
          aadhaar_number: leadObj.aadhaar_number,
          marital_status: leadObj.marital_status,
          identification_mark_1: leadObj.identification_mark_1,
          identification_mark_2: leadObj.identification_mark_2,
          disability_status: leadObj.disability_status,
          disability_description: leadObj.disability_description
        },
        contact_info: {
          email: leadObj.email || 'N/A',
          mobile_number: leadObj.mobile_number || 'N/A',
          alternate_mobile: leadObj.alternate_mobile,
          personal_email: leadObj.personal_email,
          preferred_language: leadObj.preferred_language
        },
        addresses: {
          permanent: leadObj.permanent_address,
          current: leadObj.current_address
        },
        academic_history: {
          previous_qualification: leadObj.previous_qualification,
          tenth_details: leadObj.tenth_details,
          twelfth_details: leadObj.twelfth_details
        },
        media: {
          photo_url: leadObj.photo_url,
          signature_url: leadObj.signature_url
        },
        emergency_contact: {
          name: leadObj.emergency_contact?.name || 'Guardian',
          relationship: 'Parent',
          mobile_number: leadObj.emergency_contact?.mobile_number || 'N/A'
        },
        parent_id: parentId,
        department_id: leadObj.interested_course_id,
        admission_year: leadObj.admission_year || new Date().getFullYear().toString(),
        current_semester: leadObj.semester,
        mode_of_admission: leadObj.mode_of_admission,
        status: 'ACTIVE'
      };

      const student = await Student.create(studentData);
      
      await Parent.findByIdAndUpdate(parentId, { $push: { children_ids: student._id } });
      console.log(`Created student ${student._id} for lead ${leadId}`);

      // Update Lead Status
      await Lead.findByIdAndUpdate(leadId, { status: 'Enrolled' });

      // Link Fees and Payments
      await Fee.updateMany({ lead_id: leadId }, { $set: { student_id: student._id } });
      const fees = await Fee.find({ lead_id: leadId });
      const feeIds = fees.map(f => f._id);
      await Payment.updateMany({ fee_id: { $in: feeIds } }, { $set: { student_id: student._id } });
      console.log(`Linked fees and payments for lead ${leadId} to student ${student._id}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
