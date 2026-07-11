import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../../../utils/toast.js';
import { admissionSchema, validateForm } from '../../../utils/validators.js';
import API from '../../../api/api.js';
import StudentIdCard from '../students/StudentIdCard';
import {
  CheckCircle, User, FileText, UploadCloud,
  CreditCard, ShieldCheck, ChevronRight, ChevronLeft, Printer, Home, X, Check, Image as ImageIcon, File, Eye, Zap
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Verify Lead', icon: User },
  { id: 2, title: 'Student Details', icon: FileText },
  { id: 3, title: 'Documents', icon: UploadCloud },
  { id: 4, title: 'Generate ID', icon: ShieldCheck },
  { id: 5, title: 'Fee Confirm', icon: CreditCard },
  { id: 6, title: 'Finish', icon: CheckCircle },
];

const AdmissionWizard = ({ lead, courses, questions = [], onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Lead Info
    studentName: lead?.full_name || '',
    fatherName: lead?.guardian_name || '',
    motherName: '',
    phone: lead?.mobile_number || lead?.phone || '',
    email: lead?.email || '',
    address: lead?.city || '',
    courseSelected: lead?.interested_course_id || '',
    inquiryDate: lead?.created_at ? new Date(lead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],

    // Step 2: Student Details
    dob: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: lead?.guardian_phone || '',
    qualification: '',
    occupation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    batch: '',
    section: '',
    remarks: '',
    responses: lead?.responses?.reduce((acc, r) => ({ ...acc, [r.question_id]: r.response_value }), {}) || {},

    // Step 3: Documents (Mock)
    photo: null,
    aadhaar: null,
    marksheet: null,
    signature: null,

    // Step 5: Fee
    paymentMethod: 'Cash',
    amountCollected: ''
  });

  const [studentId, setStudentId] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = React.useRef(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const [discountRules, setDiscountRules] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await API.get('/discounts');
        if (res.data.success) {
          setDiscountRules(res.data.data.filter(d => d.is_active));
        }
      } catch (err) {
        console.error('Failed to fetch discounts:', err);
      }
    };
    fetchDiscounts();
  }, []);

  const toTitleCase = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Sync lead prop to formData in case it updates or mounts late
  useEffect(() => {
    if (lead) {
      setFormData(prev => ({
        ...prev,
        studentName: toTitleCase(lead.full_name) || prev.studentName,
        fatherName: toTitleCase(lead.guardian?.first_name || lead.father?.first_name) || prev.fatherName,
        motherName: toTitleCase(lead.mother?.first_name) || prev.motherName,
        phone: lead.mobile_number || lead.phone || prev.phone,
        email: lead.email || prev.email,
        address: toTitleCase(lead.city) || prev.address,
        courseSelected: lead.interested_course_id || prev.courseSelected,
        inquiryDate: lead.created_at ? new Date(lead.created_at).toISOString().split('T')[0] : prev.inquiryDate,
        dob: lead.dob ? new Date(lead.dob).toISOString().split('T')[0] : prev.dob,
        gender: lead.gender || prev.gender,
        bloodGroup: lead.blood_group || prev.bloodGroup,
        emergencyContact: lead.emergency_contact?.mobile_number || lead.guardian?.mobile_number || lead.father?.mobile_number || prev.emergencyContact,
        qualification: toTitleCase(lead.qualification || lead.previous_qualification?.school_college_name) || prev.qualification,
        occupation: toTitleCase(lead.occupation) || prev.occupation,
        batch: lead.preferredBatch || prev.batch,
        section: toTitleCase(lead.section) || prev.section,
        responses: lead.responses?.reduce((acc, r) => ({ ...acc, [r.question_id]: r.response_value }), {}) || prev.responses
      }));
    }
  }, [lead]);

  // Dynamically fetch the selected course object
  const selectedCourseObj = courses?.find(c => c.id === formData.courseSelected || c._id === formData.courseSelected);
  
  const admissionFee = 2500;
  const courseFee = selectedCourseObj?.fee_structure?.total_fee || 45000;
  
  const selectedDiscountRule = discountRules.find(d => d.id === selectedDiscountId || d._id === selectedDiscountId);
  let discountAmount = 0;
  if (selectedDiscountRule) {
    if (selectedDiscountRule.type === 'Percentage') {
      discountAmount = (courseFee * selectedDiscountRule.value) / 100;
    } else {
      discountAmount = selectedDiscountRule.value;
    }
  }

  const tax = (courseFee - discountAmount) * 0.18;
  const totalPayable = admissionFee + courseFee - discountAmount + tax;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.studentName || !formData.phone || !formData.courseSelected) {
        showToast('Please fill all mandatory fields (Name, Course, Phone)', 'error');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.dob || !formData.gender || !formData.bloodGroup || !formData.emergencyContact || !formData.batch) {
        showToast('Please fill all mandatory student details', 'error');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Auto capitalize specific fields
    const titleCaseFields = ['studentName', 'fatherName', 'motherName', 'address', 'qualification', 'occupation', 'section'];
    if (titleCaseFields.includes(name) && typeof formattedValue === 'string') {
      formattedValue = toTitleCase(formattedValue);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleResponseChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value }
    }));
  };

  const handleGenerateId = () => {
    const prefix = 'DRN';
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    setStudentId(`${prefix}${year}${random}`);
    setAdmissionNo(`ADM-${year}-${random}`);
    setAdmissionNo(`ADM-${year}-${random}`);
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id || c.id === Number(id));
    return course ? course.course_name : 'Selected Course';
  };

  const handleFileUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      // Mock upload progress
      setUploadProgress(prev => ({ ...prev, [docType]: 10 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[docType] || 10;
          if (current >= 100) {
            clearInterval(interval);
            setFormData(prevData => ({
              ...prevData,
              [docType]: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type }
            }));
            setTimeout(() => setUploadProgress(p => ({ ...p, [docType]: 0 })), 500);
            return { ...prev, [docType]: 100 };
          }
          return { ...prev, [docType]: current + 20 };
        });
      }, 150);
    }
  };

  const handleFinalSubmit = async () => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);

    try {
      if (!lead || !lead.id) {
        showToast('Lead ID is missing. Cannot create enrollment.', 'error');
        submitLock.current = false;
        setIsSubmitting(false);
        return;
      }

      const payload = {
        lead_id: lead.id,
        course_id: String(formData.courseSelected),
        total_amount: admissionFee + courseFee,
        discount_amount: discountAmount,
        tax_amount: tax
      };

      const validation = validateForm(admissionSchema, payload);
      if (!validation.success) {
        const msgs = Object.values(validation.errors).join(', ');
        showToast(msgs, 'error');
        submitLock.current = false;
        setIsSubmitting(false);
        return;
      }

      // Create Fee Structure
      const feeRes = await API.post('/fees', payload);
      const feeId = feeRes.data.data.id;

      // Record Initial Payment if any amount was collected
      const collectedAmount = Number(formData.amountCollected);
      if (!isNaN(collectedAmount) && collectedAmount > 0) {
        await API.post('/payments', {
          fee_id: feeId,
          amount_paid: collectedAmount,
          payment_method: formData.paymentMethod,
          remarks: 'Initial Admission Payment'
        });
      }

      // Admit Student: Creates Student, Parent, updates Lead, and links Fee/Payment
      const admitRes = await API.post(`/v2/students/admit/${lead.id}`, { formData });
      if (admitRes.data?.data?.student) {
        const studentObj = admitRes.data.data.student;
        setStudentId(studentObj.enrollment_number || studentObj.student_id || studentObj.id);
      }

      // ONLY navigate to Finish step on success, do not reset isSubmitting
      // to avoid double clicks during the transition.
      handleNextStep();
    } catch (err) {
      console.error('Enrollment failed', err);
      showToast(err.response?.data?.message || 'Failed to process enrollment.', 'error');
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-2">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Verify Lead Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group mb-0">
                <label className="form-label">Student Name</label>
                <input type="text" className="form-input bg-muted" name="studentName" value={formData.studentName} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Course Selected</label>
                <select className="form-select bg-muted" name="courseSelected" value={formData.courseSelected} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input bg-muted" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input bg-muted" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Father's Name</label>
                <input type="text" className="form-input" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Mother's Name</label>
                <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleChange} />
              </div>
              <div className="form-group mb-0 col-span-2">
                <label className="form-label">Address / City</label>
                <textarea className="form-textarea w-full p-3 border border-border rounded-md bg-surface text-foreground" rows="2" name="address" value={formData.address} onChange={handleChange}></textarea>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-2">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Student Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="form-group mb-0">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Blood Group</label>
                <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Emergency Contact</label>
                <input type="text" className="form-input" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Qualification</label>
                <input type="text" className="form-input" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Tech" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Occupation</label>
                <input type="text" className="form-input" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g. Student" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Joining Date</label>
                <input type="date" className="form-input" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Batch Assigned</label>
                <select className="form-select" name="batch" value={formData.batch} onChange={handleChange}>
                  <option value="">Select Batch</option>
                  <option value="Morning">Morning (9 AM - 12 PM)</option>
                  <option value="Evening">Evening (4 PM - 7 PM)</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Section</label>
                <input type="text" className="form-input" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. A" />
              </div>
              <div className="form-group mb-0 col-span-3">
                <label className="form-label">Remarks / Special Notes</label>
                <textarea className="form-textarea w-full p-3 border border-border rounded-md bg-surface text-foreground" rows="2" name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
              </div>
            </div>

            {questions && questions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-lg font-semibold mb-4 text-foreground">Additional Qualifying Details</h4>
                <div className="grid grid-cols-2 gap-6">
                  {questions.map(q => (
                    <div key={q.id} className="form-group mb-0">
                      <label className="form-label">{q.question_text} {q.is_required && '*'}</label>

                      {q.type === 'text' && (
                        <input type="text" className="form-input" value={formData.responses[q.id] || ''} onChange={(e) => handleResponseChange(q.id, e.target.value)} />
                      )}

                      {q.type === 'dropdown' && (
                        <select className="form-select" value={formData.responses[q.id] || ''} onChange={(e) => handleResponseChange(q.id, e.target.value)}>
                          <option value="">-- Select --</option>
                          {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      )}

                      {q.type === 'radio' && (
                        <div className="flex flex-col gap-2 mt-1">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                              <input type="radio" name={`aw_q_${q.id}`} value={opt} checked={formData.responses[q.id] === opt} onChange={() => handleResponseChange(q.id, opt)} className="accent-primary" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'checkbox' && (
                        <div className="flex flex-col gap-2 mt-1">
                          {q.options.map(opt => {
                            const currentValues = formData.responses[q.id] ? formData.responses[q.id].split(', ') : [];
                            const isChecked = currentValues.includes(opt);
                            return (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                                <input type="checkbox" checked={isChecked} onChange={() => {
                                  let newValues = isChecked ? currentValues.filter(v => v !== opt) : [...currentValues, opt];
                                  handleResponseChange(q.id, newValues.join(', '));
                                }} className="accent-primary" />
                                {opt}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      case 3:
        const docs = [
          { key: 'photo', label: 'Student Photo (Passport Size)', icon: ImageIcon },
          { key: 'aadhaar', label: 'Aadhaar Card (Front & Back)', icon: File },
          { key: 'marksheet', label: 'Previous Marksheet', icon: FileText },
          { key: 'signature', label: 'Student Signature', icon: ImageIcon },
        ];
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-2">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Upload Documents</h3>
            <div className="grid grid-cols-2 gap-6">
              {docs.map(doc => (
                <div key={doc.key} className="border border-border border-dashed rounded-lg p-6 bg-surface flex flex-col items-center justify-center relative hover:border-primary transition-colors group">
                  {!formData[doc.key] ? (
                    <>
                      <doc.icon className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-medium text-foreground mb-1">{doc.label}</p>
                      <p className="text-xs text-muted-foreground mb-4">Drag & drop or click to upload</p>
                      <label className="btn btn-secondary text-xs px-4 py-1.5 cursor-pointer">
                        Browse File
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                      </label>
                    </>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <Check className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1 truncate w-full text-center">{formData[doc.key].name}</p>
                      <p className="text-xs text-muted-foreground">{formData[doc.key].size}</p>
                      <button onClick={() => setFormData(prev => ({ ...prev, [doc.key]: null }))} className="text-xs text-destructive hover:underline mt-2">Remove</button>
                    </div>
                  )}
                  {uploadProgress[doc.key] > 0 && uploadProgress[doc.key] < 100 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-200" style={{ width: `${uploadProgress[doc.key]}%` }}></div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-2 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md w-full">
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-2 text-foreground">Generate Student ID</h3>
              <p className="text-muted-foreground mb-8">Generate a unique institutional identity card number and admission record for {formData.studentName}.</p>

              {!studentId ? (
                <button onClick={handleGenerateId} className="btn btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <Zap className="w-5 h-5" /> Generate Identity
                </button>
              ) : (
                <div className="animate-fade-in">
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Student ID</p>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">{studentId}</h2>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Admission No.</p>
                        <p className="font-medium text-foreground">{admissionNo}</p>
                      </div>
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center opacity-50">
                        {/* Fake QR */}
                        <div className="grid grid-cols-3 gap-1 w-8 h-8">
                          {[...Array(9)].map((_, i) => <div key={i} className={`bg-foreground rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleNextStep} className="btn btn-primary w-full py-3">Continue to Payment</button>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-2">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Fee Confirmation</h3>
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3">
                <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="bg-muted px-6 py-4 border-b border-border flex justify-between items-center">
                    <h4 className="font-semibold text-foreground">Invoice Summary</h4>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider">Draft</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Admission Fee</span>
                      <span className="font-medium text-foreground">₹{admissionFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Course Fee ({getCourseName(formData.courseSelected)})</span>
                      <span className="font-medium text-foreground">₹{courseFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50 items-center">
                      <span className="text-muted-foreground">Special Discount</span>
                      <div className="flex items-center gap-4">
                        <select
                          className="form-select text-sm py-1 px-2 border-border/50"
                          value={selectedDiscountId}
                          onChange={(e) => setSelectedDiscountId(e.target.value)}
                        >
                          <option value="">No Discount</option>
                          {discountRules.map(rule => (
                            <option key={rule.id || rule._id} value={rule.id || rule._id}>
                              {rule.name} ({rule.type === 'Percentage' ? `${rule.value}%` : `₹${rule.value}`})
                            </option>
                          ))}
                        </select>
                        <span className="font-medium text-emerald-600">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-medium text-foreground">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-4 mt-2">
                      <span className="text-lg font-bold text-foreground">Total Payable</span>
                      <span className="text-xl font-bold text-primary">₹{totalPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
                  <h4 className="font-semibold text-foreground mb-4">Payment Collection</h4>
                  <div className="form-group">
                    <label className="form-label">Amount to Collect Today <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                      <input type="number" className="form-input text-lg font-semibold" style={{ paddingLeft: '2rem' }} value={formData.amountCollected} onChange={(e) => setFormData({ ...formData, amountCollected: e.target.value })} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Payment Mode</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Cash', 'UPI', 'Card', 'Bank Transfer'].map(mode => (
                        <div
                          key={mode}
                          onClick={() => setFormData({ ...formData, paymentMethod: mode })}
                          className={`p-3 border rounded-md text-center cursor-pointer transition-all text-sm font-medium
                            ${formData.paymentMethod === mode ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/50'}`}
                        >
                          {mode}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleFinalSubmit} disabled={isSubmitting || submitLock.current} className="btn btn-primary w-full py-4 text-lg shadow-md flex items-center justify-center gap-2">
                  {isSubmitting ? <span className="spinner w-5 h-5 border-2"></span> : <><CheckCircle className="w-5 h-5" /> Confirm Admission</>}
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100/50">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Enrollment Successful!</h2>
            <p className="text-muted-foreground mb-8 text-lg">Student {formData.studentName} has been admitted and added to the roster.</p>

            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mb-8 text-left shadow-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Student ID</span>
                <span className="font-semibold text-foreground">{studentId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Course</span>
                <span className="font-semibold text-foreground">{getCourseName(formData.courseSelected)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Fee Collected</span>
                <span className="font-semibold text-emerald-600">₹{Number(formData.amountCollected || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Status</span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase">Enrolled</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn btn-secondary flex items-center gap-2"><Printer className="w-4 h-4" /> Print Receipt</button>
              <button onClick={() => setShowIdCard(true)} className="btn btn-secondary flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Print ID Card</button>
              <button onClick={onComplete} className="btn btn-primary flex items-center gap-2"><Home className="w-4 h-4" /> Return to Dashboard</button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">D</div>
          <span className="font-semibold text-lg text-foreground tracking-tight">Admission Wizard</span>
        </div>
        {currentStep < 6 && (
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        )}

      {showIdCard && (
        <StudentIdCard student={{ ...formData, id: studentId }} onClose={() => setShowIdCard(false)} />
      )}
    </div>

      {/* Stepper */}
      <div className="bg-card border-b border-border px-8 py-6 shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full overflow-hidden z-0">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>

            {steps.map((step, idx) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isActive || isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--card))',
                      borderColor: isActive || isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      color: isActive || isCompleted ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                      scale: isActive ? 1.1 : 1
                    }}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-colors duration-300`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </motion.div>
                  <span className={`text-xs font-semibold uppercase tracking-wider absolute -bottom-6 w-32 text-center left-1/2 -translate-x-1/2 transition-colors duration-300 ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-background p-8">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-sm min-h-[500px] flex flex-col relative">
          <div className="flex-1 p-6 overflow-x-hidden">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          {currentStep < 6 && (
            <div className="border-t border-border p-6 bg-muted/30 flex justify-between rounded-b-xl shrink-0 mt-auto">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`btn btn-secondary flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {currentStep < 5 && (
                <button onClick={handleNextStep} className="btn btn-primary flex items-center gap-2">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionWizard;
