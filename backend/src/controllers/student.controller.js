const Student = require('../models/student.model');
const Parent = require('../models/parent.model');
const Lead = require('../models/lead.model'); // Legacy model
const Fee = require('../models/fee.model');
const Payment = require('../models/payment.model');
const mongoose = require('mongoose');

/**
 * @desc    Admit a Lead, creating a Student and Parent record
 * @route   POST /api/v2/students/admit/:lead_id
 * @access  Private (Admin)
 */
exports.admitLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.lead_id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (lead.status === 'Enrolled') {
      return res.status(400).json({ success: false, message: 'Lead is already enrolled' });
    }

    const leadObj = lead.toObject();
    const formData = req.body.formData || {};

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Create Parent Document
      const parentData = {
        father: { 
          ...leadObj.father, 
          first_name: formData.fatherName || leadObj.father?.first_name || 'N/A',
          last_name: leadObj.father?.last_name || 'N/A',
          mobile_number: leadObj.father?.mobile_number || leadObj.mobile_number || 'N/A',
          occupation: leadObj.father?.occupation || 'N/A'
        },
        mother: { 
          ...leadObj.mother, 
          first_name: formData.motherName || leadObj.mother?.first_name || 'N/A',
          last_name: leadObj.mother?.last_name || 'N/A',
          mobile_number: leadObj.mother?.mobile_number || leadObj.alternate_mobile || leadObj.mobile_number || 'N/A'
        },
        guardian: leadObj.guardian,
        primary_contact: 'FATHER' // Default or derive from frontend
      };

      const newParentArray = await Parent.create([parentData], { session });
      const newParent = newParentArray[0];
      const parentId = newParent._id;

    // 2. Create Student Document
    const firstName = formData.studentName ? formData.studentName.split(' ')[0] : leadObj.full_name.split(' ')[0];
    const lastName = formData.studentName && formData.studentName.includes(' ') ? formData.studentName.split(' ').slice(1).join(' ') : leadObj.last_name;

    const studentData = {
      personal_info: {
        first_name: firstName,
        middle_name: leadObj.middle_name,
        last_name: lastName || 'N/A',
        dob: formData.dob || leadObj.dob || new Date('2000-01-01'),
        gender: formData.gender || leadObj.gender || 'Male',
        blood_group: formData.bloodGroup || leadObj.blood_group,
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
        email: formData.email || leadObj.email || 'N/A',
        mobile_number: formData.phone || leadObj.mobile_number || 'N/A',
        alternate_mobile: leadObj.alternate_mobile,
        personal_email: leadObj.personal_email,
        preferred_language: leadObj.preferred_language
      },
      addresses: {
        permanent: leadObj.permanent_address,
        current: {
          ...leadObj.current_address,
          city: formData.address || leadObj.current_address?.city || leadObj.city
        }
      },
      academic_history: {
        previous_qualification: { ...leadObj.previous_qualification, school_college_name: formData.qualification || leadObj.previous_qualification?.school_college_name },
        tenth_details: leadObj.tenth_details,
        twelfth_details: leadObj.twelfth_details
      },
      media: {
        photo_url: leadObj.photo_url,
        signature_url: leadObj.signature_url
      },
      emergency_contact: {
        name: formData.fatherName || leadObj.emergency_contact?.name || 'Guardian',
        relationship: 'Parent',
        mobile_number: formData.emergencyContact || leadObj.emergency_contact?.mobile_number || 'N/A'
      },
      parent_id: parentId,
      department_id: formData.courseSelected || leadObj.interested_course_id,
      admission_year: leadObj.admission_year || new Date().getFullYear().toString(),
      current_semester: leadObj.semester,
      mode_of_admission: leadObj.mode_of_admission,
      status: 'ACTIVE'
    };

      const newStudentArray = await Student.create([studentData], { session });
      const newStudent = newStudentArray[0];

      // 3. Link Parent to Student
      await Parent.findByIdAndUpdate(
        parentId, 
        { $push: { children_ids: newStudent._id } },
        { session }
      );

      // 4. Update Lead Status
      await Lead.findByIdAndUpdate(
        req.params.lead_id, 
        { status: 'Enrolled' },
        { session }
      );

      // 5. Migrate Financial Records to Student
      const fees = await Fee.find({ lead_id: req.params.lead_id }).session(session);
      if (fees.length > 0) {
        const feeIds = fees.map(f => f._id);
        await Fee.updateMany(
          { _id: { $in: feeIds } },
          { $set: { student_id: newStudent._id } },
          { session }
        );
        await Payment.updateMany(
          { fee_id: { $in: feeIds } },
          { $set: { student_id: newStudent._id } },
          { session }
        );
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        message: 'Lead successfully admitted as Student',
        data: {
          student: newStudent,
          parent: newParent
        }
      });
    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      
      // Fallback for standalone MongoDB (like local dev) which doesn't support transactions
      if (transactionError.message.includes('replica set') || transactionError.message.includes('mongos')) {
        console.warn('MongoDB transactions not supported on this instance. Retrying without transaction...');
        
        // 1. Create Parent
        const parentData = {
          father: { 
            ...leadObj.father, 
            first_name: formData.fatherName || leadObj.father?.first_name || 'N/A',
            last_name: leadObj.father?.last_name || 'N/A',
            mobile_number: leadObj.father?.mobile_number || leadObj.mobile_number || 'N/A',
            occupation: leadObj.father?.occupation || 'N/A'
          },
          mother: { 
            ...leadObj.mother, 
            first_name: formData.motherName || leadObj.mother?.first_name || 'N/A',
            last_name: leadObj.mother?.last_name || 'N/A',
            mobile_number: leadObj.mother?.mobile_number || leadObj.alternate_mobile || leadObj.mobile_number || 'N/A'
          },
          guardian: leadObj.guardian,
          primary_contact: 'FATHER'
        };
        const newParent = await Parent.create(parentData);
        
        // 2. Create Student
        const firstName = formData.studentName ? formData.studentName.split(' ')[0] : leadObj.full_name.split(' ')[0];
        const lastName = formData.studentName && formData.studentName.includes(' ') ? formData.studentName.split(' ').slice(1).join(' ') : leadObj.last_name;
        
        const studentData = {
          personal_info: {
            first_name: firstName,
            middle_name: leadObj.middle_name,
            last_name: lastName || 'N/A',
            dob: formData.dob || leadObj.dob || new Date('2000-01-01'),
            gender: formData.gender || leadObj.gender || 'Male',
            blood_group: formData.bloodGroup || leadObj.blood_group,
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
            email: formData.email || leadObj.email || 'N/A',
            mobile_number: formData.phone || leadObj.mobile_number || 'N/A',
            alternate_mobile: leadObj.alternate_mobile,
            personal_email: leadObj.personal_email,
            preferred_language: leadObj.preferred_language
          },
          addresses: {
            permanent: leadObj.permanent_address,
            current: {
              ...leadObj.current_address,
              city: formData.address || leadObj.current_address?.city || leadObj.city
            }
          },
          academic_history: {
            previous_qualification: { ...leadObj.previous_qualification, school_college_name: formData.qualification || leadObj.previous_qualification?.school_college_name },
            tenth_details: leadObj.tenth_details,
            twelfth_details: leadObj.twelfth_details
          },
          media: {
            photo_url: leadObj.photo_url,
            signature_url: leadObj.signature_url
          },
          emergency_contact: {
            name: formData.fatherName || leadObj.emergency_contact?.name || 'Guardian',
            relationship: 'Parent',
            mobile_number: formData.emergencyContact || leadObj.emergency_contact?.mobile_number || 'N/A'
          },
          parent_id: newParent._id,
          department_id: formData.courseSelected || leadObj.interested_course_id,
          admission_year: leadObj.admission_year || new Date().getFullYear().toString(),
          current_semester: leadObj.semester,
          mode_of_admission: leadObj.mode_of_admission,
          status: 'ACTIVE'
        };
        
        const newStudent = await Student.create(studentData);
        
        // 3. Link
        await Parent.findByIdAndUpdate(newParent._id, { $push: { children_ids: newStudent._id } });
        
        // 4. Update Lead
        await Lead.findByIdAndUpdate(req.params.lead_id, { status: 'Enrolled' });
        
        // 5. Migrate Financial
        const fees = await Fee.find({ lead_id: req.params.lead_id });
        if (fees.length > 0) {
          const feeIds = fees.map(f => f._id);
          await Fee.updateMany({ _id: { $in: feeIds } }, { $set: { student_id: newStudent._id } });
          await Payment.updateMany({ fee_id: { $in: feeIds } }, { $set: { student_id: newStudent._id } });
        }
        
        return res.status(201).json({
          success: true,
          message: 'Lead successfully admitted as Student (non-transactional fallback)',
          data: { student: newStudent, parent: newParent }
        });
      }
      
      throw transactionError; // Will be caught by the outer catch if not replica set error
    }

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/v2/students
 * @access  Private
 */
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ deleted_at: null }).populate('parent_id').populate('department_id');
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
