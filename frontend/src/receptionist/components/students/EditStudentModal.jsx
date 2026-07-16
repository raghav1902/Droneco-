import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../../../api/api';
import { showToast } from '../../../utils/toast';

const EditStudentModal = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    personal_info: { first_name: '', last_name: '', dob: '', gender: 'Male', category: 'General', nationality: 'Indian' },
    contact_info: { email: '', mobile_number: '' },
    addresses: {
      permanent: { city: '', state: '', pin_code: '' }
    },
    status: 'ACTIVE'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      // Deep copy to avoid mutating the original prop immediately
      const copy = JSON.parse(JSON.stringify(student));
      
      // Ensure nested objects exist to avoid undefined errors
      if (!copy.personal_info) copy.personal_info = {};
      if (!copy.contact_info) copy.contact_info = {};
      if (!copy.addresses) copy.addresses = { permanent: {}, current: {} };
      if (!copy.addresses.permanent) copy.addresses.permanent = {};
      
      setFormData(copy);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [name]: value
      }
    }));
  };
  
  const handleDeepNestedChange = (e, section, subsection) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [subsection]: {
           ...(prev[section]?.[subsection] || {}),
           [name]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    const isV2 = !!student.personal_info;
    const phone = isV2 ? formData.contact_info?.mobile_number : formData.mobile_number;
    const emailStr = isV2 ? formData.contact_info?.email : formData.email;
    const dobStr = isV2 ? formData.personal_info?.dob : formData.dob;

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      showToast('Invalid Mobile Number', 'error');
      return;
    }
    
    if (emailStr && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      showToast('Invalid Email Format', 'error');
      return;
    }

    if (dobStr) {
      const dobDate = new Date(dobStr);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 15) {
        showToast('Minimum age must be 15 years', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const studentId = student.id || student._id || student.student_id;
      // Depending on if it's a lead or student
      const endpoint = student.personal_info ? `/v2/students/${studentId}` : `/leads/${studentId}`;
      const { data } = await API.put(endpoint, formData);
      if (data.success) {
        showToast('Student updated successfully', 'success');
        onUpdate(data.data);
      } else {
        showToast(data.message || 'Failed to update student', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update student. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1100, padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="bg-card border border-border rounded-xl shadow-lg animate-fade-in flex flex-col" style={{
        maxWidth: '800px', width: '100%', maxHeight: '90vh'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--foreground)' }}>Edit Student Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <form id="editStudentForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Status (For v2 or legacy) */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="status" value={formData.status || ''} onChange={handleChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* If v2 Student */}
            {student.personal_info ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Personal Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="first_name" value={formData.personal_info?.first_name || ''} onChange={(e) => handleNestedChange(e, 'personal_info')} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="last_name" value={formData.personal_info?.last_name || ''} onChange={(e) => handleNestedChange(e, 'personal_info')} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">DOB</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="date" name="dob" value={formData.personal_info?.dob ? formData.personal_info.dob.split('T')[0] : ''} onChange={(e) => handleNestedChange(e, 'personal_info')} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Gender</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="gender" value={formData.personal_info?.gender || ''} onChange={(e) => handleNestedChange(e, 'personal_info')}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Contact Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Mobile</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="mobile_number" value={formData.contact_info?.mobile_number || ''} onChange={(e) => handleNestedChange(e, 'contact_info')} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="email" name="email" value={formData.contact_info?.email || ''} onChange={(e) => handleNestedChange(e, 'contact_info')} required />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Address (Permanent)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">City</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="city" value={formData.addresses?.permanent?.city || ''} onChange={(e) => handleDeepNestedChange(e, 'addresses', 'permanent')} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">State</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="state" value={formData.addresses?.permanent?.state || ''} onChange={(e) => handleDeepNestedChange(e, 'addresses', 'permanent')} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Pin Code</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="pin_code" value={formData.addresses?.permanent?.pin_code || ''} onChange={(e) => handleDeepNestedChange(e, 'addresses', 'permanent')} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Legacy Lead Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Lead Info (Legacy)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="full_name" value={formData.full_name || ''} onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Mobile</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="mobile_number" value={formData.mobile_number || ''} onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">City</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="city" value={formData.city || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </>
            )}

          </form>
        </div>
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary shadow-sm" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" form="editStudentForm" className="btn btn-primary shadow-sm" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
