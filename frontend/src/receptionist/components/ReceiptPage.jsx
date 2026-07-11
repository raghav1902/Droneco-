import React, { useState, useEffect } from 'react';
import { Download, Printer, Share2, CheckCircle, ArrowLeft } from 'lucide-react';
import { showToast } from '../../utils/toast.js';
import API from '../../api/api.js';

const ReceiptPage = ({ transaction, onBack }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get('/settings');
        if (response.data?.success && response.data?.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load settings for receipt:', error);
      }
    };
    fetchSettings();
  }, []);

  if (!transaction) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <p>No transaction selected.</p>
        <button className="btn btn-primary mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const studentName = transaction.fee_id?.lead_id?.full_name || 'Unknown Student';
  const studentId = transaction.fee_id?.lead_id?._id || transaction.fee_id?.lead_id?.id || 'N/A';
  // Use a fallback for courseName if it's not populated, though usually we display the program/course
  const courseName = typeof transaction.fee_id?.lead_id?.interested_course_id === 'object' ? transaction.fee_id?.lead_id?.interested_course_id?.course_name : (transaction.fee_id?.lead_id?.interested_course_id || 'Course Fee');
  
  const dateStr = new Date(transaction.transaction_date).toLocaleDateString();
  const totalPaid = (transaction.amount_paid || 0) + (transaction.late_fee || 0);

  return (
    <div className="bg-[#f1f4f2] text-[#181c1b] min-h-screen flex flex-col items-center font-['Inter',sans-serif]">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
            .no-print { display: none !important; }
            .receipt-card { box-shadow: none !important; border: 1px solid #6e7976 !important; }
            body { background: white !important; padding: 0 !important; }
            .print-container { margin: 0 !important; max-width: 100% !important; }
        }
      `}} />
      
      {/* Action Toolbar */}
      <div className="w-full max-w-4xl px-4 pt-6 pb-4 flex justify-between items-center no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-[#3e4946] hover:text-[#004f45] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold uppercase tracking-widest text-[12px]">Back to Portal</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast('Share not implemented yet!', 'info')} className="flex items-center gap-1 px-4 py-2 text-[#4c616c] border border-[#bec9c5] bg-[#f7faf8] rounded hover:bg-[#f1f4f2] transition-all">
            <Share2 className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[12px]">Share</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 text-[#4c616c] border border-[#bec9c5] bg-[#f7faf8] rounded hover:bg-[#f1f4f2] transition-all">
            <Download className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[12px]">PDF</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 bg-[#004f45] text-[#ffffff] rounded hover:opacity-90 transition-all active:scale-95 shadow-md shadow-[#004f45]/20">
            <Printer className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[12px]">Print</span>
          </button>
        </div>
      </div>

      {/* Receipt Canvas */}
      <main className="w-full max-w-4xl px-4 pb-12 print-container">
        <div className="receipt-card bg-[#ffffff] w-full border border-[#bec9c5]/30 rounded-xl overflow-hidden flex flex-col relative shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          
          {/* Brand Accent Stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#004f45]"></div>
          
          <div className="p-6 md:p-12 space-y-6">
            
            {/* Receipt Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-[#004f45]/5 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                  {settings?.institute?.logo ? (
                    <img alt="Institute Logo" className="w-full h-full object-contain" src={settings.institute.logo}/>
                  ) : (
                    <img alt="Droneco Institute Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFDb1xFF7NV_NRKwWP__KQdUiCxKjOABgCpRNVScs2a7BUk_ffdJfXflRBpe9fpvfEiNasw27oJ3vlRpClAXhZiYAxR6hvxhKFdlITVdz7sEy9vbn0itedTnWL5bhljcHoiHe8oLqn-dgwVcptGZbIRQHt5Fo-Afbtlh2wEi07_IYcKDTUtfU8hnmh33WrBXQQSROvnyuZ1fiKwDwN4n6mOy4fY35DQ_-dlDkYWcVKSJ70rWOGiF3NWH1I1VjW9P7u65o"/>
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-[32px] font-black text-[#004f45] tracking-tighter uppercase leading-none">
                    {settings?.institute?.name || 'Droneco'}
                  </h2>
                  <p className="text-[14px] text-[#3e4946] leading-relaxed max-w-xs whitespace-pre-line">
                    {settings?.institute?.address ? settings.institute.address + '\n' : '123 Education Lane, Tech District\n'}
                    {settings?.institute?.email || 'contact@institute.edu'} | {settings?.institute?.contact || '+1 234-567-8900'}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end space-y-1">
                <div className="flex items-center gap-1 text-[#004f45] font-bold bg-[#004f45]/5 px-4 py-1 rounded-full">
                  <CheckCircle className="w-5 h-5 fill-[#004f45] text-white" />
                  <span className="font-bold uppercase tracking-widest text-[12px]">PAID</span>
                </div>
                <h3 className="text-[16px] font-bold text-[#181c1b] max-w-[250px] leading-tight mt-4">
                  Receipt #{settings?.receipt?.prefix || 'REC-'}{transaction.receipt_number}
                </h3>
                <p className="text-[14px] text-[#3e4946]">Date: {dateStr}</p>
              </div>
            </div>

            {/* Banner Message */}
            <div className="bg-[#ebefec] py-2 px-4 text-center rounded border border-[#bec9c5]/20">
              <p className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946]">
                {settings?.receipt?.header || 'Tech Academy Official Receipt'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#bec9c5]/20 pb-6">
              <div className="space-y-4">
                <div>
                  <p className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946] mb-1">Billed To</p>
                  <p className="text-[24px] font-bold text-[#181c1b] leading-none mb-1">{studentName}</p>
                  <p className="font-mono text-[13px] font-medium text-[#3e4946] break-all">ID: {studentId}</p>
                </div>
              </div>
              <div className="text-left md:text-right space-y-4">
                <div>
                  <p className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946] mb-1">Payment Info</p>
                  <p className="text-[16px] text-[#181c1b]">Method: <span className="font-bold capitalize">{transaction.payment_method}</span></p>
                  {transaction.reference_number && (
                    <p className="text-[16px] text-[#181c1b]">Ref: <span className="font-bold">{transaction.reference_number}</span></p>
                  )}
                </div>
              </div>
            </div>

            {/* Line Item Table */}
            <div className="space-y-4 min-h-[160px]">
              <div className="flex justify-between border-b border-[#bec9c5]/50 pb-2">
                <span className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946]">Description</span>
                <span className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946]">Amount</span>
              </div>
              
              <div className="flex justify-between items-center py-4">
                <div className="space-y-1">
                  <span className="text-[16px] text-[#181c1b] font-semibold">Course Fee Installment</span>
                  <p className="text-[14px] text-[#3e4946]">{courseName}</p>
                </div>
                <span className="font-mono text-[18px] text-[#181c1b] font-bold">₹{transaction.amount_paid?.toLocaleString()}</span>
              </div>
              
              {transaction.late_fee > 0 && (
                <div className="flex justify-between items-center py-4 border-t border-[#bec9c5]/20">
                  <div className="space-y-1">
                    <span className="text-[16px] text-[#181c1b] font-semibold">Late Fee Penalty</span>
                  </div>
                  <span className="font-mono text-[18px] text-[#181c1b] font-bold">₹{transaction.late_fee?.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Receipt Footer Summary */}
            <div className="flex flex-col md:flex-row justify-between items-end pt-6 mt-auto gap-6">
              <div className="text-[#3e4946] italic text-[14px] bg-[#f1f4f2] px-4 py-2 rounded border border-dashed border-[#bec9c5]/30">
                "{settings?.receipt?.footerMessage || 'Thank you for your payment.'}"
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-4">
                  <span className="text-[24px] font-semibold text-[#4c616c] opacity-60">Total Paid:</span>
                  <span className="font-bold text-[48px] tracking-tight text-[#004f45] leading-none">₹{totalPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Document Footer Decorative Area */}
          <div className="bg-[#e0e3e1] px-6 py-4 mt-12 text-center">
            <p className="text-[14px] text-[#3e4946] font-medium">
              © {new Date().getFullYear()} {settings?.institute?.name || 'Droneco Institute Technical Academy'}. All Rights Reserved.
            </p>
            <p className="font-bold uppercase tracking-widest text-[10px] text-[#3e4946] opacity-60 mt-1">Computer Generated Receipt - No Signature Required</p>
          </div>
        </div>
      </main>

      {/* Support Footer (Web Only) */}
      <footer className="mt-auto w-full max-w-4xl px-4 py-6 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#bec9c5]/20 pt-6">
          <p className="font-bold uppercase tracking-widest text-[12px] text-[#3e4946]">{settings?.institute?.name || 'Droneco Technical Academy'}</p>
          <div className="flex gap-6">
            <a className="text-[14px] text-[#4c616c] hover:text-[#004f45] transition-colors" href="#">Terms</a>
            <a className="text-[14px] text-[#4c616c] hover:text-[#004f45] transition-colors" href="#">Privacy</a>
            <a className="text-[14px] text-[#4c616c] hover:text-[#004f45] transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReceiptPage;
