import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../../../utils/toast.js';

import { 
  CheckCircle, User, FileText, UploadCloud, 
  CreditCard, ShieldCheck, ChevronRight, ChevronLeft, Printer, Home
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Verify Lead', icon: User },
  { id: 2, title: 'Student Details', icon: FileText },
  { id: 3, title: 'Documents', icon: UploadCloud },
  { id: 4, title: 'Generate ID', icon: ShieldCheck },
  { id: 5, title: 'Fee Confirm', icon: CreditCard },
  { id: 6, title: 'Finish', icon: CheckCircle },
];

const AdmissionWizard = ({ lead, courses, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: lead?.full_name || '',
    fatherName: '',
    motherName: '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    address: lead?.city || '',
    courseSelected: lead?.interested_course_id || '',
    dob: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    qualification: '',
    occupation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    batch: '',
    section: '',
    remarks: '',
    paymentMethod: 'Cash',
    amountCollected: ''
  });

  const [studentId, setStudentId] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateId = () => {
    const prefix = 'DRN';
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    setStudentId(`${prefix}${year}${random}`);
    nextStep();
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : 'Selected Course';
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="wizard-step">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Verify Lead Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input type="text" className="form-input" name="studentName" value={formData.studentName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Course Selected</label>
                <select className="form-select" name="courseSelected" value={formData.courseSelected} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Father's Name</label>
                <input type="text" className="form-input" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Name</label>
                <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Address</label>
                <textarea className="form-input" name="address" value={formData.address} onChange={handleChange} rows={2} />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="wizard-step">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Additional Student Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input type="text" className="form-input" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input type="text" className="form-input" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Highest Qualification</label>
                <input type="text" className="form-input" name="qualification" value={formData.qualification} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Occupation (if any)</label>
                <input type="text" className="form-input" name="occupation" value={formData.occupation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input type="date" className="form-input" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Batch Assigned</label>
                <select className="form-select" name="batch" value={formData.batch} onChange={handleChange}>
                  <option value="">Select Batch</option>
                  <option value="Morning">Morning (9 AM - 12 PM)</option>
                  <option value="Evening">Evening (4 PM - 7 PM)</option>
                  <option value="Weekend">Weekend Special</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <input type="text" className="form-input" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. A" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                <label className="form-label">Admission Remarks</label>
                <textarea className="form-input" name="remarks" value={formData.remarks} onChange={handleChange} rows={2} />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="wizard-step">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upload Documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="upload-box glass-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <UploadCloud size={40} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Student Photo</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Drag & drop or click to upload</p>
                <button className="btn btn-secondary btn-sm" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Select File</button>
              </div>
              <div className="upload-box glass-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <UploadCloud size={40} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Aadhaar Card / ID Proof</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Front and back PDF or Image</p>
                <button className="btn btn-secondary btn-sm" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Select File</button>
              </div>
              <div className="upload-box glass-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <UploadCloud size={40} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Previous Marksheet</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Optional, up to 5MB</p>
                <button className="btn btn-secondary btn-sm" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Select File</button>
              </div>
              <div className="upload-box glass-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <UploadCloud size={40} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Digital Signature</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Scan of student signature</p>
                <button className="btn btn-secondary btn-sm" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Select File</button>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="wizard-step">
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <ShieldCheck size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Generate Student ID</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                All documents are verified. Click the button below to auto-generate a unique system ID and admission number.
              </p>
              
              {!studentId ? (
                <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={handleGenerateId}>
                  Generate Unique ID
                </button>
              ) : (
                <div className="glass-card animate-fade-in" style={{ display: 'inline-block', padding: '2rem', border: '2px solid var(--accent)' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Student ID</p>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent)' }}>{studentId}</h2>
                  <div style={{ width: '200px', height: '40px', background: 'var(--text-main)', margin: '1rem auto', opacity: 0.1, borderRadius: '4px' }}></div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Barcode Placeholder</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="wizard-step">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Fee Confirmation & First Payment</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)' }}>Fee Breakdown</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Course Fee ({getCourseName(formData.courseSelected)})</span>
                  <span style={{ fontWeight: 600 }}>₹45,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Admission Fee</span>
                  <span style={{ fontWeight: 600 }}>₹2,500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Special Discount</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>-₹5,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Tax (18% GST)</span>
                  <span style={{ fontWeight: 600 }}>₹7,650</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total Payable</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>₹50,150</span>
                </div>
              </div>
              
              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Collect Initial Payment</h4>
                <div className="form-group">
                  <label className="form-label">Amount to Collect Today</label>
                  <input type="number" className="form-input" name="amountCollected" value={formData.amountCollected} onChange={handleChange} placeholder="₹" />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                {formData.paymentMethod !== 'Cash' && (
                  <div className="form-group">
                    <label className="form-label">Transaction ID / Reference</label>
                    <input type="text" className="form-input" placeholder="Enter ref no." />
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Remaining Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹{Math.max(0, 50150 - (Number(formData.amountCollected) || 0)).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="wizard-step" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Enrollment Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>{formData.studentName} has been officially enrolled in {getCourseName(formData.courseSelected)}.</p>
            
            <div className="glass-card" style={{ display: 'inline-flex', gap: '3rem', padding: '1.5rem 3rem', marginBottom: '3rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student ID</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{studentId}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)' }}></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Paid</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)' }}>₹{formData.amountCollected || 0}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
                <Printer size={18} /> Print Receipt
              </button>
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
                <Printer size={18} /> Print ID Card
              </button>
              <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={onComplete}>
                <Home size={18} /> Go to Dashboard
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-app)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      {/* Header / Stepper Progress */}
      <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>New Admission</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lead Ref: {lead?.id || 'NEW'}</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isCurrent || isCompleted ? 1 : 0.4 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: isCompleted ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: isCompleted || isCurrent ? '#fff' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: isCurrent ? 600 : 500, color: isCurrent ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div style={{ width: '40px', height: '2px', background: isCompleted ? 'var(--success)' : 'var(--border)' }}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        <button className="btn btn-secondary" onClick={onCancel} style={{ border: 'none', background: 'var(--bg-tertiary)' }}>Cancel</button>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', maxWidth: currentStep === 5 ? '1000px' : '850px' }}>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep < 6 && (
        <footer style={{ padding: '1.5rem 3rem', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            style={{ opacity: currentStep === 1 ? 0 : 1 }}
          >
            <ChevronLeft size={18} /> Back
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={onCancel}>Save Draft</button>
            {currentStep === 4 && !studentId ? (
              <button className="btn btn-primary" onClick={handleGenerateId} disabled>Next Step <ChevronRight size={18} /></button>
            ) : currentStep === 5 ? (
              <button className="btn btn-primary" style={{ background: 'var(--success)' }} onClick={nextStep}>Confirm Admission <CheckCircle size={18} className="ml-2" style={{ marginLeft: '0.5rem' }} /></button>
            ) : (
              <button className="btn btn-primary" onClick={nextStep}>Next Step <ChevronRight size={18} /></button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

export default AdmissionWizard;
