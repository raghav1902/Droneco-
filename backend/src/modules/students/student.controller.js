const Student = require('./student.model');
const Parent = require('../parents/parent.model');
const Lead = require('../leads/lead.model'); // Legacy model
const mongoose = require('mongoose');

/**
 * @desc    Admit a Lead, creating a Student and Parent record
 * @route   POST /api/v2/students/admit/:lead_id
 * @access  Private (Admin)
 */
exports.admitLead = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lead = await Lead.findById(req.params.lead_id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (lead.status === 'Enrolled') {
      return res.status(400).json({ success: false, message: 'Lead is already enrolled' });
    }

    // 1. Create Parent Document
    const parentData = {
      father: lead.father,
      mother: lead.mother,
      guardian: lead.guardian,
      primary_contact: 'FATHER' // Default or derive from frontend
    };

    const newParent = await Parent.create([parentData], { session });
    const parentId = newParent[0]._id;

    // 2. Create Student Document
    const studentData = {
      personal_info: {
        first_name: lead.full_name.split(' ')[0],
        middle_name: lead.middle_name,
        last_name: lead.last_name,
        dob: lead.dob,
        gender: lead.gender,
        blood_group: lead.blood_group,
        category: lead.category,
        nationality: lead.nationality,
        aadhaar_number: lead.aadhaar_number,
        marital_status: lead.marital_status,
        identification_mark_1: lead.identification_mark_1,
        identification_mark_2: lead.identification_mark_2,
        disability_status: lead.disability_status,
        disability_description: lead.disability_description
      },
      contact_info: {
        email: lead.email,
        mobile_number: lead.mobile_number,
        alternate_mobile: lead.alternate_mobile,
        personal_email: lead.personal_email,
        preferred_language: lead.preferred_language
      },
      addresses: {
        permanent: lead.permanent_address,
        current: lead.current_address
      },
      academic_history: {
        previous_qualification: lead.previous_qualification,
        tenth_details: lead.tenth_details,
        twelfth_details: lead.twelfth_details
      },
      media: {
        photo_url: lead.photo_url,
        signature_url: lead.signature_url
      },
      emergency_contact: lead.emergency_contact,
      parent_id: parentId,
      admission_year: lead.admission_year || new Date().getFullYear().toString(),
      current_semester: lead.semester,
      mode_of_admission: lead.mode_of_admission,
      status: 'ACTIVE'
    };

    const newStudent = await Student.create([studentData], { session });

    // 3. Link Parent to Student
    await Parent.findByIdAndUpdate(
      parentId, 
      { $push: { children_ids: newStudent[0]._id } },
      { session }
    );

    // 4. Update Lead Status
    lead.status = 'Enrolled';
    await lead.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Lead successfully admitted as Student',
      data: {
        student: newStudent[0],
        parent: newParent[0]
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
    const students = await Student.find({ deleted_at: null }).populate('parent_id');
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
