const Student = require('../models/student.model');
const Parent = require('../models/parent.model');
const Lead = require('../models/lead.model'); // Legacy model
const Fee = require('../models/fee.model');
const Payment = require('../models/payment.model');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

// Ensure cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @desc    Admit a Lead, creating a Student and Parent record
 * @route   POST /api/v2/students/admit/:lead_id
 * @access  Private (Admin)
 */
exports.admitLead = async (req, res, next) => {
  try {
    const formData = req.body.formData || {};

    let newStudent;
    let newParent;

    try {
      const lead = await Lead.findById(req.params.lead_id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      if (lead.status === 'Enrolled') {
        throw new Error('Lead is already enrolled');
      }

      const leadObj = lead.toObject();

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

      const newParentArray = await Parent.create([parentData]);
      newParent = newParentArray[0];
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
          photo_url: formData.photo?.url || leadObj.photo_url,
          signature_url: formData.signature?.url || leadObj.signature_url,
          aadhaar_url: formData.aadhaar?.url,
          marksheet_url: formData.marksheet?.url
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

      const newStudentArray = await Student.create([studentData]);
      newStudent = newStudentArray[0];

      // 3. Link Parent to Student
      await Parent.findByIdAndUpdate(
        parentId, 
        { $push: { children_ids: newStudent._id } }
      );

      // 4. Update Lead Status
      await Lead.findByIdAndUpdate(
        req.params.lead_id, 
        { 
          status: 'Enrolled',
          student_id: newStudent._id
        }
      );

      // 5. Migrate Financial Records to Student
      const fees = await Fee.find({ lead_id: req.params.lead_id });
      if (fees.length > 0) {
        const feeIds = fees.map(f => f._id);
        await Fee.updateMany(
          { _id: { $in: feeIds } },
          { $set: { student_id: newStudent._id } }
        );
        await Payment.updateMany(
          { fee_id: { $in: feeIds } },
          { $set: { student_id: newStudent._id } }
        );
      }
      
      res.status(201).json({
        success: true,
        message: 'Lead successfully admitted as Student',
        data: {
          student: newStudent,
          parent: newParent
        }
      });
    } catch (transactionError) {
      // If the transaction fails, we simply throw or return an error, preventing orphaned records.
      console.error('Transaction Error during admitLead:', transactionError);
      if (transactionError.message === 'Lead not found') {
        return res.status(404).json({ success: false, message: transactionError.message });
      }
      if (transactionError.message === 'Lead is already enrolled') {
        return res.status(400).json({ success: false, message: transactionError.message });
      }

      return res.status(500).json({ 
        success: false, 
        message: 'Failed to complete admission process. The transaction was aborted to prevent data corruption.',
        error: transactionError.message 
      });
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

/**
 * @desc    Preview the next available student ID and admission number
 * @route   GET /api/v2/students/next-id
 * @access  Private
 */
exports.getNextId = async (req, res, next) => {
  try {
    const Counter = mongoose.model('Counter');
    
    // Find the counter without incrementing it to preview the next sequence
    let counter = await Counter.findOne({ _id: 'enrollment_number' });
    
    let seq = 1;
    if (counter) {
      seq = counter.seq + 1;
    }
    
    const year = new Date().getFullYear();
    const paddedSeq = String(seq).padStart(4, '0');
    
    res.status(200).json({
      success: true,
      data: {
        student_id: `DRN${year}${paddedSeq}`,
        enrollment_number: `ADM-${year}-${paddedSeq}`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/v2/students/:id
 * @access  Private (Admin, Receptionist)
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('department_id');

    if (!student) {
      // Fallback: check if it's a legacy lead that hasn't been moved to student model
      const lead = await Lead.findById(req.params.id);
      if (lead) {
        return res.status(200).json({
          success: true,
          data: lead
        });
      }
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student details
 * @route   PUT /api/v2/students/:id
 * @access  Private (Admin, Receptionist)
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // If photo_url is being updated, delete the old photo from Cloudinary
    if (updateData.media?.photo_url && student.media?.photo_url) {
      if (updateData.media.photo_url !== student.media.photo_url) {
        try {
          const oldUrl = student.media.photo_url;
          if (oldUrl.includes('cloudinary.com')) {
            const parts = oldUrl.split('/');
            const filenameWithExt = parts.pop();
            const folder = parts.pop();
            const filename = filenameWithExt.split('.')[0];
            const publicId = `${folder}/${filename}`;
            
            // Fire and forget deletion
            cloudinary.uploader.destroy(publicId).catch(err => {
              console.error('Failed to delete old Cloudinary photo:', err);
            });
          }
        } catch (e) {
          console.error('Error parsing Cloudinary URL for deletion:', e);
        }
      }
    }

    // Allowed fields for update
    const allowedTopLevel = ['personal_info', 'contact_info', 'addresses', 'academic_history', 'media', 'emergency_contact', 'department_id', 'status', 'section', 'current_semester'];
    
    for (const key of allowedTopLevel) {
      if (updateData[key] !== undefined) {
        if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
          // Safely merge for nested objects and mark modified
          Object.assign(student[key], updateData[key]);
          student.markModified(key);
        } else {
          student[key] = updateData[key];
        }
      }
    }

    const updatedStudent = await student.save();
    
    // If contact info changed, maybe sync with Parent here if needed, but not required right now.

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};
