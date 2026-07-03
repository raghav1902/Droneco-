import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, FileText, CreditCard, History, Clock, Bookmark, ArrowLeft, CheckCircle, Edit, Download, GraduationCap, Briefcase } from 'lucide-react';

const StudentProfile = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewDoc, setPreviewDoc] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Bookmark },
    { id: 'fees', label: 'Fee Details', icon: CreditCard },
    { id: 'history', label: 'Payment History', icon: History },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'remarks', label: 'Remarks', icon: FileText }
  ];

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
            <span className="text-sm font-semibold text-primary">{student.id}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="btn btn-secondary gap-2 border-border shadow-sm" onClick={() => alert('Edit profile functionality coming soon!')}>
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button className="btn btn-primary shadow-sm" onClick={() => alert('Fee collection opens in the collection tab.')}>
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
              <div className="w-24 h-24 rounded-full bg-surface border-4 border-card text-primary flex items-center justify-center text-4xl font-bold shadow-md mx-auto -mt-12 mb-4 relative">
                {student.name.split(' ').map(n => n[0]).join('')}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-card rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{student.course}</p>
              
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border ${student.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {student.status}
              </span>

              <div className="flex flex-col gap-3 text-left border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Phone className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground truncate">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Mail className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground truncate">{student.email || 'student@example.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><MapPin className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground truncate">New Delhi, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0"><Calendar className="w-4 h-4" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium text-foreground truncate">15 Jan 2026</p>
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
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <h3 className="text-lg font-semibold text-foreground mb-6">Financial Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Total Fee</p>
                      <h4 className="text-2xl font-bold text-foreground">₹45,000</h4>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle className="w-12 h-12 text-emerald-500" /></div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Fee Paid</p>
                      <h4 className="text-2xl font-bold text-emerald-600">₹25,000</h4>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-12 h-12 text-rose-500" /></div>
                      <p className="text-sm text-rose-600/80 font-medium mb-1">Balance Due</p>
                      <h4 className="text-2xl font-bold text-rose-600">₹20,000</h4>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
                  <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                    <div className="relative pl-8">
                      <div className="absolute -left-[17px] top-1 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-card shadow-sm"><CreditCard className="w-3.5 h-3.5 text-emerald-600" /></div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Fee Installment Paid</h4>
                      <p className="text-sm text-muted-foreground mb-1">Received ₹5,000 via UPI</p>
                      <p className="text-xs text-muted-foreground/70 font-medium">01 Jul 2026, 10:30 AM</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute -left-[17px] top-1 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border-4 border-card shadow-sm"><User className="w-3.5 h-3.5 text-primary" /></div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Admission Completed</h4>
                      <p className="text-sm text-muted-foreground mb-1">Assigned to {student.batch} Batch</p>
                      <p className="text-xs text-muted-foreground/70 font-medium">15 Jan 2026, 11:15 AM</p>
                    </div>
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
                          <span className="text-sm text-muted-foreground">Date of Birth</span>
                          <span className="text-sm font-medium text-foreground col-span-2">24 Aug 2004</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                          <span className="text-sm text-muted-foreground">Gender</span>
                          <span className="text-sm font-medium text-foreground col-span-2">Male</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                          <span className="text-sm text-muted-foreground">Blood Group</span>
                          <span className="text-sm font-medium text-foreground col-span-2">O+</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Family & Emergency</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                          <span className="text-sm text-muted-foreground">Father's Name</span>
                          <span className="text-sm font-medium text-foreground col-span-2">Rakesh Sharma</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                          <span className="text-sm text-muted-foreground">Mother's Name</span>
                          <span className="text-sm font-medium text-foreground col-span-2">Sunita Sharma</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b border-border/50 pb-3">
                          <span className="text-sm text-muted-foreground">Emergency Contact</span>
                          <span className="text-sm font-medium text-foreground col-span-2">+91 9876500000 (Father)</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 mt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Qualification</h4>
                      <div className="bg-background border border-border rounded-lg p-4 flex gap-4 items-center">
                        <Briefcase className="w-8 h-8 text-primary/50" />
                        <div>
                          <p className="font-semibold text-foreground">B.Tech (Computer Science)</p>
                          <p className="text-sm text-muted-foreground">Delhi Technological University, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Uploaded Documents</h3>
                    <button className="btn btn-secondary text-sm h-8 gap-2"><Download className="w-3 h-3" /> Download All</button>
                  </div>
                  
                  {student.documents && student.documents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {student.documents.map(doc => (
                        <div key={doc} className="border border-border rounded-lg bg-background overflow-hidden group">
                          <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                            <Bookmark className="w-8 h-8 text-muted-foreground/50" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button onClick={() => setPreviewDoc(doc)} className="p-2 bg-white/20 hover:bg-white/40 rounded text-white backdrop-blur-sm"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 bg-white/20 hover:bg-white/40 rounded text-white backdrop-blur-sm"><Download className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="p-3 border-t border-border">
                            <p className="text-sm font-medium text-foreground truncate">{doc}</p>
                            <p className="text-xs text-muted-foreground">Uploaded: 15 Jan 2026</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] bg-muted/30 border border-dashed border-border rounded-lg">
                      <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-3" />
                      <p className="text-foreground font-medium">No documents uploaded yet</p>
                      <p className="text-sm text-muted-foreground mb-4">Files like photos and ID cards will appear here.</p>
                      <button className="btn btn-secondary btn-sm" onClick={() => alert('Document upload modal coming soon!')}>Upload Document</button>
                    </div>
                  )}
                </motion.div>
              )}

              {!['overview', 'personal', 'documents'].includes(activeTab) && (
                <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                  <FileText className="w-16 h-16 opacity-20 mb-4" />
                  <p className="text-lg">Detailed {tabs.find(t=>t.id===activeTab)?.label} will appear here.</p>
                  <p className="text-sm opacity-70">This module is under active development.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-card rounded-lg overflow-hidden max-w-3xl w-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Preview: {previewDoc}</h3>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setPreviewDoc(null)}>Close</button>
            </div>
            <div className="bg-muted p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <Bookmark className="w-20 h-20 mx-auto opacity-20 mb-4" />
                <p>This is a placeholder preview for {previewDoc}</p>
                <p className="text-sm mt-2 opacity-70">Backend file storage integration required.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
