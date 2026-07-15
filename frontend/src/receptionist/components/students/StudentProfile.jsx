import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, FileText, CreditCard, History, Clock, Bookmark, ArrowLeft, CheckCircle, Edit, Download, GraduationCap, Briefcase, Printer, Upload, Loader2 } from 'lucide-react';
import API from '../../../api/api';
import { showToast } from '../../../utils/toast';
import StudentIdCard from './StudentIdCard';
import { getAssetUrl } from '../../../utils/assetUrl';
import EditStudentModal from './EditStudentModal';
const StudentProfile = ({ student, onBack, onCollectFee }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [feeData, setFeeData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [fullStudentData, setFullStudentData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!student || (!student._id && !student.id)) return;
    const leadId = student.id || student._id;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [feeRes, payRes, studentRes] = await Promise.all([
          API.get(`/fees/student/${leadId}`).catch(() => ({ data: { data: [] } })),
          API.get(`/payments?lead_id=${leadId}`).catch(() => ({ data: { data: [] } })),
          API.get(`/v2/students/${leadId}`).catch(() => ({ data: { data: null } }))
        ]);

        if (feeRes.data.data && feeRes.data.data.length > 0) {
          setFeeData(feeRes.data.data[0]);
        }
        if (payRes.data.data) {
          setPayments(payRes.data.data);
        }
        if (studentRes.data.data) {
          setFullStudentData(studentRes.data.data);
        } else {
          setFullStudentData(student); // fallback
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
        showToast('Failed to fetch student details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      // 1. Upload the file to the server
      const uploadRes = await API.post('/upload', formData, {
        headers: { 'Content-Type': undefined } // Let the browser set it with the correct boundary
      });

      if (uploadRes.data?.success) {
        const photoUrl = uploadRes.data.filePath;

        // 2. Update the student's or lead's profile with the new photo URL
        const studentId = student._id || student.id;
        const isStudent = student.enrollment_number || student.student_id;
        
        let updateRes;
        if (isStudent) {
          updateRes = await API.put(`/v2/students/${studentId}`, {
            media: {
              ...student.media,
              photo_url: photoUrl
            }
          });
        } else {
          updateRes = await API.put(`/leads/${studentId}`, {
            photo_url: photoUrl
          });
        }

        if (updateRes.data?.success) {
          // Update the local student object so the UI refreshes immediately
          if (isStudent) {
            if (!student.media) student.media = {};
            student.media.photo_url = photoUrl;
          } else {
            student.photo_url = photoUrl;
          }
          alert('Profile photo uploaded successfully! You can now print the ID card.');
        }
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Bookmark },
    { id: 'fees', label: 'Fee Details', icon: CreditCard },
    { id: 'history', label: 'Payment History', icon: History },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'remarks', label: 'Remarks', icon: FileText }
  ];

  if (!student) return null;

  const displayStudent = fullStudentData || student;

  // Support both Lead schema (v1) and Student schema (v2)
  const fullName = displayStudent.full_name || `${displayStudent.personal_info?.first_name || ''} ${displayStudent.personal_info?.last_name || ''}`.trim() || 'Unknown Student';
  const phone = displayStudent.mobile_number || displayStudent.contact_info?.mobile_number || 'N/A';
  const emailStr = displayStudent.email || displayStudent.contact_info?.email || 'N/A';
  const cityStr = displayStudent.city || displayStudent.addresses?.current?.city || displayStudent.addresses?.permanent?.city || 'N/A';
  const joinDate = new Date(displayStudent.submitted_at || displayStudent.createdAt || displayStudent.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const courseIdStr = displayStudent.interestedCourse || displayStudent.interested_course_id?.course_name || displayStudent.interested_course_id?.name || displayStudent.department_id?.course_name || displayStudent.department_id?.name || displayStudent.course?.course_name || 'N/A';

  return (
    <div className="animate-fade-in pb-12">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button className="btn btn-secondary p-2 rounded-full border-border shadow-sm hover:bg-muted" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">ID:</span>
            <span className="text-sm font-semibold text-primary">{displayStudent.enrollment_number || displayStudent.student_id || displayStudent.id || displayStudent._id}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="btn btn-secondary gap-2 border-border shadow-sm" onClick={() => setShowEditModal(true)}>
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button className="btn btn-secondary gap-2 border-border shadow-sm" onClick={() => setShowIdCard(true)}>
            <Printer className="w-4 h-4" /> Print ID
          </button>
          <button className="btn btn-primary shadow-sm" onClick={() => onCollectFee ? onCollectFee(student) : alert('Fee collection unavailable')}>
            Collect Fee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

        {/* Left: Sticky Profile Card */}
        <div className="xl:col-span-1">
          <div className="bg-card border border-border rounded-xl shadow-sm sticky top-6 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/80 to-accent"></div>
            <div className="px-6 pb-6 relative text-center">
              <div className="w-24 h-24 rounded-full bg-surface border-4 border-card text-primary flex items-center justify-center text-4xl font-bold shadow-md mx-auto -mt-12 mb-4 relative overflow-hidden">
                {displayStudent.media?.photo_url || displayStudent.photo_url ? (
                  <img src={`${getAssetUrl(displayStudent.media?.photo_url || displayStudent.photo_url)}?t=${Date.now()}`} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-card rounded-full z-10"></div>
              </div>
              <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
              <p className="text-sm text-muted-foreground mb-4">Course: {courseIdStr}</p>

              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border ${displayStudent.status === 'ACTIVE' || displayStudent.status === 'Enrolled' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                {displayStudent.status || 'ACTIVE'}
              </span>

              <div className="flex flex-col gap-3 text-left border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Phone className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground truncate">{phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Mail className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground truncate">{emailStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><MapPin className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground truncate">{cityStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Calendar className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium text-foreground truncate">{joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="xl:col-span-3 flex flex-col min-h-[600px]">

          {/* Custom Tabs Navigation */}
          <div className="bg-card border border-border rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                  >
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Panels */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-8 flex-1 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                <p>Loading student data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-6">Financial Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground font-medium mb-1">Total Fee</p>
                        <h4 className="text-2xl font-bold text-foreground">₹{feeData ? feeData.net_payable : '0'}</h4>
                      </div>
                      <div className="bg-background border border-border rounded-lg p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle className="w-12 h-12 text-emerald-500" /></div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Fee Paid</p>
                        <h4 className="text-2xl font-bold text-emerald-600">₹{feeData ? feeData.paid_amount : '0'}</h4>
                      </div>
                      <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-12 h-12 text-rose-500" /></div>
                        <p className="text-sm text-rose-600/80 font-medium mb-1">Balance Due</p>
                        <h4 className="text-2xl font-bold text-rose-600">₹{feeData ? feeData.due_amount : '0'}</h4>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-6">Recent Payments</h3>
                    <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                      {payments.length === 0 ? (
                        <p className="text-muted-foreground ml-6">No payments recorded yet.</p>
                      ) : (
                        payments.slice(0, 5).map(payment => (
                          <div key={payment._id} className="relative pl-8">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-card shadow-sm"><CreditCard className="w-3.5 h-3.5 text-emerald-600" /></div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">Fee Installment Paid</h4>
                            <p className="text-sm text-muted-foreground mb-1">Received ₹{payment.amount_paid} via {payment.payment_method}</p>
                            <p className="text-xs text-muted-foreground/70 font-medium">{new Date(payment.transaction_date).toLocaleString('en-GB')}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'personal' && (
                  <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-6">Personal & Background Details</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Basic Details</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">Mobile</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.mobile_number || displayStudent.contact_info?.mobile_number || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.email || displayStudent.contact_info?.email || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">City</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.city || displayStudent.addresses?.permanent?.city || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Family & Emergency</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">Guardian Name</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.guardian_name || displayStudent.guardian?.name || displayStudent.emergency_contact?.name || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">Relation</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.guardian_relation || displayStudent.guardian?.relation || displayStudent.emergency_contact?.relationship || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                            <span className="text-sm text-muted-foreground">Guardian Phone</span>
                            <span className="text-sm font-medium text-foreground col-span-2">{displayStudent.guardian_phone || displayStudent.guardian?.mobile || displayStudent.emergency_contact?.mobile_number || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 mt-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Qualification & Course</h4>
                        <div className="bg-background border border-border rounded-lg p-4 flex gap-4 items-center mb-4">
                          <Briefcase className="w-8 h-8 text-primary/50" />
                          <div>
                            <p className="font-semibold text-foreground">Qualification</p>
                            <p className="text-sm text-muted-foreground">{displayStudent.qualification || displayStudent.academic_history?.qualification || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="bg-background border border-border rounded-lg p-4 flex gap-4 items-center">
                          <Bookmark className="w-8 h-8 text-primary/50" />
                          <div>
                            <p className="font-semibold text-foreground">Interested Course</p>
                            <p className="text-sm text-muted-foreground">{courseIdStr}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'fees' && (
                  <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-6">Fee Structure Details</h3>

                    {!feeData ? (
                      <div className="p-4 border border-dashed border-border rounded text-center text-muted-foreground">
                        No fee structure assigned.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-background">
                          <span className="text-muted-foreground">Total Course Fee:</span>
                          <span className="font-semibold text-foreground">₹{feeData.total_amount}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-background">
                          <span className="text-muted-foreground">Tax Applied:</span>
                          <span className="font-semibold text-rose-600">+₹{feeData.tax_amount}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-accent/10">
                          <span className="text-foreground font-semibold">Net Payable:</span>
                          <span className="font-bold text-lg text-primary">₹{feeData.net_payable}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-6">Payment History</h3>
                    {payments.length === 0 ? (
                      <div className="p-4 border border-dashed border-border rounded text-center text-muted-foreground">
                        No payments found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border bg-muted/50">
                              <th className="p-3 text-sm font-medium text-muted-foreground">Date</th>
                              <th className="p-3 text-sm font-medium text-muted-foreground">Amount</th>
                              <th className="p-3 text-sm font-medium text-muted-foreground">Method</th>
                              <th className="p-3 text-sm font-medium text-muted-foreground">Reference</th>
                              <th className="p-3 text-sm font-medium text-muted-foreground">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map(p => (
                              <tr key={p._id} className="border-b border-border hover:bg-muted/30">
                                <td className="p-3 text-sm">{new Date(p.transaction_date).toLocaleDateString()}</td>
                                <td className="p-3 text-sm font-semibold text-emerald-600">₹{p.amount_paid}</td>
                                <td className="p-3 text-sm">{p.payment_method}</td>
                                <td className="p-3 text-sm">{p.reference_number || '-'}</td>
                                <td className="p-3 text-sm">
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">{p.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'documents' && (
                  <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-foreground">Uploaded Documents</h3>
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handlePhotoUpload} 
                          accept="image/jpeg, image/png, image/webp" 
                          style={{ display: 'none' }} 
                        />
                        <button 
                          className="btn btn-secondary btn-sm flex items-center gap-2" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          {isUploading ? 'Uploading...' : 'Upload Profile Photo'}
                        </button>
                      </div>
                    </div>

                    {!displayStudent?.media?.photo_url && !displayStudent?.media?.aadhaar_url && !displayStudent?.media?.marksheet_url && !displayStudent?.media?.signature_url ? (
                      <div className="flex flex-col items-center justify-center h-[250px] bg-muted/30 border border-dashed border-border rounded-lg">
                        <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-foreground font-medium">No documents uploaded yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Files like photos and ID cards will appear here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Student Photo', url: displayStudent?.media?.photo_url },
                          { label: 'Aadhaar Card', url: displayStudent?.media?.aadhaar_url },
                          { label: 'Previous Marksheet', url: displayStudent?.media?.marksheet_url },
                          { label: 'Signature', url: displayStudent?.media?.signature_url }
                        ].map((doc, idx) => doc.url ? (
                          <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">{doc.label}</span>
                            </div>
                            <a href={getAssetUrl(doc.url)} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium">View File</a>
                          </div>
                        ) : null)}
                      </div>
                    )}
                  </motion.div>
                )}

                {!['overview', 'personal', 'documents', 'fees', 'history'].includes(activeTab) && (
                  <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                    <FileText className="w-16 h-16 opacity-20 mb-4" />
                    <p className="text-lg">Detailed {tabs.find(t => t.id === activeTab)?.label} will appear here.</p>
                    <p className="text-sm opacity-70">This module is under active development.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      
      {showIdCard && (
        <StudentIdCard student={displayStudent} onClose={() => setShowIdCard(false)} />
      )}
      
      {showEditModal && (
        <EditStudentModal 
          student={displayStudent} 
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedData) => {
             setFullStudentData(updatedData);
             setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentProfile;
