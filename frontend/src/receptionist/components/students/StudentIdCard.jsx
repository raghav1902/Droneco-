import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Printer, X } from 'lucide-react';
import API from '../../../api/api';
import { getAssetUrl } from '../../../utils/assetUrl';
const StudentIdCard = ({ student, onClose }) => {
  const printRef = useRef();
  const [courseName, setCourseName] = useState(
    student?.courseName ||
    student?.interestedCourse ||
    student?.department_id?.course_name ||
    student?.interested_course_id?.course_name ||
    'N/A'
  );

  useEffect(() => {
    const fetchCourse = async () => {
      const courseId = student?.courseSelected ||
        (typeof student?.department_id === 'string' ? student.department_id : student?.department_id?._id) ||
        (typeof student?.interested_course_id === 'string' ? student.interested_course_id : student?.interested_course_id?._id);

      if (courseId && courseId.length === 24 && (courseName === 'N/A' || !courseName)) {
        try {
          const res = await API.get(`/courses/${courseId}`);
          if (res.data?.success && res.data.data) {
            setCourseName(res.data.data.course_name);
          }
        } catch (err) {
          console.error('Failed to fetch course for ID card', err);
        }
      }
    };
    fetchCourse();
  }, [student, courseName]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-10000px';
    iframe.style.bottom = '-10000px';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
      <head>
        <title>Print ID Card</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
          @media print {
            @page { size: auto; margin: 0; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 20px; font-family: 'Inter', sans-serif; background: white; }
            .id-card-wrapper { display: block; text-align: center; }
            .id-card-canvas { display: inline-block; margin: 0 auto 40px auto; page-break-inside: avoid; page-break-after: always; }
            .id-card-canvas:last-child { page-break-after: auto; }
            .no-print { display: none !important; }
          }
          .id-card-canvas {
              width: 320px;
              height: 500px;
              background-color: #ffffff;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
              border: 1px solid #e5e9e6;
          }
          .watermark-overlay {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 140%;
              opacity: 0.03;
              pointer-events: none;
              z-index: 0;
              filter: grayscale(1);
          }
          .watermark-logo {
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPEXaoWad8hP26_3puwLVah438EjNkrHW7mRJYyAEOBLqnQLeEh8HMGvtNLhs4R3StfgYqtm6a2GDe6nHpwk0A7qmC8gyVlQGMSaiEjWUGHjQ-w-I0JQvH1MY2JVabuiX9nYJmgVyPucN3GKVAB9fIRrYIhYaFy2mqQGL62Tigp75gBVCP5McFll34lyT9wmUR4AeJErJPhL4EIR9dQRuuCHpBMG7s_pA-VML2IuQp-Av0I9Qhr6nIYkwD3_-4-R7nUJ4');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              opacity: 0.04;
              transform: scale(1.5) rotate(-15deg);
          }
        </style>
      </head>
      <body>
        <div class="id-card-wrapper">${printContent}</div>
      </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 250);
  };

  if (!student) return null;

  // Formatting dates and fields
  const joinDate = new Date(student.created_at || Date.now()).getFullYear();
  const validTill = new Date(joinDate + 4, 6, 31).getFullYear();
  const answers = student.answers || {};

  const getParentName = (parentObj, fallback) => {
    if (parentObj?.first_name) {
      return `${parentObj.first_name} ${parentObj.last_name || ''}`.trim();
    }
    return fallback;
  };

  const fatherName = getParentName(student.father, student.fatherName || student.parent_info?.father_name || answers['Father Name'] || answers['father_name'] || 'N/A');
  const motherName = getParentName(student.mother, student.motherName || student.parent_info?.mother_name || answers['Mother Name'] || answers['mother_name'] || 'N/A');

  const bloodGroup = student.bloodGroup || student.personal_info?.blood_group || answers['Blood Group'] || answers['blood_group'] || 'O+';
  const emergencyContact = student.emergencyContact || student.emergency_contact?.mobile_number || answers['Emergency Contact'] || answers['emergency_contact'] || 'N/A';

  const getFullAddress = () => {
    const addr = student.addresses?.permanent || student.addresses?.current || student.permanent_address;
    if (addr && (addr.city || addr.state)) {
      return [addr.house_no, addr.street, addr.city, addr.state, addr.pin_code].filter(Boolean).join(', ');
    }
    return student.address || student.city || 'N/A';
  };
  const address = getFullAddress();

  // Format ID for barcode and display
  const fallbackId = student.id ? student.id.slice(-6).toUpperCase() : '000000';
  const realStudentId = student.student_id || student.enrollment_number || `DRN-${joinDate}-${fallbackId}`;
  // Strip hyphens for the barcode so it scans cleaner
  const barcodeValue = realStudentId.replace(/-/g, '');

  // Resolve Photo URL securely using the backend URL
  let photoUrl = getAssetUrl(student.photo_url || student.media?.photo_url);
  if (photoUrl) {
    photoUrl = `${photoUrl}?t=${Date.now()}`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 sm:p-8">
      <div className="bg-card w-full max-w-5xl rounded-xl shadow-2xl border border-border flex flex-col md:flex-row overflow-hidden relative">

        {/* Controls */}
        <div className="bg-muted p-6 border-b md:border-b-0 md:border-r border-border flex flex-col items-center justify-center gap-6 md:w-64 shrink-0">
          <div className="text-center">
            <h2 className="text-xl font-bold">Print ID Card</h2>
            <p className="text-sm text-muted-foreground mt-2">Use high-quality PVC or glossy paper for best results.</p>
          </div>
          <button
            onClick={handlePrint}
            className="btn btn-primary w-full gap-2 shadow-sm"
          >
            <Printer className="w-5 h-5" /> Print Now
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary w-full gap-2 shadow-sm"
          >
            <X className="w-5 h-5" /> Cancel
          </button>
        </div>

        {/* Printable Area Container */}
        <div className="p-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#f7faf8] overflow-auto">

          <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
            .id-card-canvas {
                width: 320px;
                height: 500px;
                background-color: #ffffff;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
                border: 1px solid #e5e9e6;
            }
            .watermark-overlay {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 140%;
                opacity: 0.03;
                pointer-events: none;
                z-index: 0;
                filter: grayscale(1);
            }
            .watermark-logo {
                background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPEXaoWad8hP26_3puwLVah438EjNkrHW7mRJYyAEOBLqnQLeEh8HMGvtNLhs4R3StfgYqtm6a2GDe6nHpwk0A7qmC8gyVlQGMSaiEjWUGHjQ-w-I0JQvH1MY2JVabuiX9nYJmgVyPucN3GKVAB9fIRrYIhYaFy2mqQGL62Tigp75gBVCP5McFll34lyT9wmUR4AeJErJPhL4EIR9dQRuuCHpBMG7s_pA-VML2IuQp-Av0I9Qhr6nIYkwD3_-4-R7nUJ4');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 0.04;
                transform: scale(1.5) rotate(-15deg);
            }
            .font-signature { font-family: 'Mrs Saint Delafield', cursive; }
          `}} />

          <div ref={printRef} className="flex flex-col lg:flex-row gap-8 id-card-wrapper">

            {/* FRONT OF ID CARD */}
            <div className="id-card-canvas rounded-xl flex flex-col bg-[#ffffff] shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#9e1a22] z-20"></div>
              <img alt="Watermark" className="watermark-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV1JGG6ZbehUqACAhQdLpCK_SkCFb5agKmKLdPWz07GHRFimrJN-P-0JVzJwmmfJ71fKuvbl_Wy1GBxwcd56cHV_NXw6F8VGgZcftlWKTGVpBsxVEYEt_93cGhwXn0gaf3zsJELlvRyJDhfWlf8I8DX3sQiDlC7IyT5593jky_J-H8a2khPGBToq8BoxnBMcqv-k8DFqWNWJqyxejFnmvVdE8YDCfcvG8Tfhcd3OXYewOxKEjpQuuGjaje2EvHzeaOabs" />
              <div className="relative z-10 flex-grow flex flex-col px-4 pt-6 pb-4">

                {/* Header Logo Section */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <img alt="Droneco Logo" className="w-7 h-7 object-contain rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm-qINd7tQoIxc4y2CPmwxXWRDMbeCrYYunPmPLGhgrSnR8kQtNhMUvS2cumwCvEUvbW7INGNVQW4oU4XF-XtIwFCMfO7rih9jeaKB9pieBwJnDQTAn0a6-f-GAko6f414vchcuhVh3EJEi6CskRXvd5K4Z2lEiYN4vlVVH1fjktOfhuhgS7M6kPJcsCFeTbYmIs8uNXn993K-LmWu5vNi66tCrPIzGdHALp2x90SmKSc1c4xkliorWiGDW-8FMgVN6CQ" />
                    <span className="text-[12px] text-[#004f45] font-bold tracking-tight uppercase">DRONECO INSTITUTE</span>
                  </div>
                  <span className="text-[#6e7976] font-bold uppercase tracking-[0.2em] text-[10px]">Front Panel</span>
                </div>

                {/* Student Image Section */}
                <div className="flex justify-center mb-4 mt-2">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-[4px] border-[#9e1a22]/10 shadow-lg overflow-hidden bg-white flex items-center justify-center">
                      {photoUrl ? (
                        <img className="w-full h-full object-cover" alt="Student Headshot" src={photoUrl} />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 mb-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          <span className="text-[10px] uppercase font-bold tracking-wider">No Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & ID */}
                <div className="text-center mb-6">
                  <h2 className="text-[20px] text-[#004f45] font-extrabold uppercase tracking-tight leading-tight">
                    {student.full_name || student.studentName || `${student.personal_info?.first_name || ''} ${student.personal_info?.last_name || ''}`.trim() || 'STUDENT'}
                  </h2>
                  <div className="inline-block px-3 py-0.5 border border-[#9e1a22]/30 bg-[#9e1a22]/5 rounded-full mt-1">
                    <p className="font-mono text-[11px] text-[#9e1a22] font-bold">ID: {realStudentId}</p>
                  </div>
                </div>

                {/* Details List */}
                <div className="flex flex-col gap-2 px-2">
                  <div className="flex justify-between items-center border-b border-[#9e1a22]/10 pb-1">
                    <span className="text-[9px] text-[#9e1a22] font-bold uppercase tracking-wider">Phone</span>
                    <span className="text-[13px] text-[#181c1b] font-semibold">{student.phone || student.contact_info?.mobile_number || student.mobile_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#9e1a22]/10 pb-1">
                    <span className="text-[9px] text-[#9e1a22] font-bold uppercase tracking-wider">Course</span>
                    <span className="text-[13px] text-[#181c1b] font-semibold text-right max-w-[160px] truncate">{courseName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#9e1a22]/10 pb-1">
                    <span className="text-[9px] text-[#9e1a22] font-bold uppercase tracking-wider">Department</span>
                    <span className="text-[13px] text-[#181c1b] font-semibold">Engineering</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#9e1a22] font-bold uppercase tracking-wider">Session</span>
                    <span className="text-[13px] text-[#181c1b] font-semibold">{joinDate}-{validTill}</span>
                  </div>
                </div>

                {/* Footer Section: Signature */}
                <footer className="mt-auto pt-4 flex justify-center">
                  <div className="flex flex-col items-center">
                    <span className="font-signature text-[28px] text-[#004f45]/80 h-8 flex items-center select-none">H. Miller</span>
                    <div className="w-32 border-t border-[#9e1a22]/30 mt-1"></div>
                    <span className="text-[9px] text-[#6e7976] mt-1 font-bold tracking-widest uppercase">Principal</span>
                  </div>
                </footer>
              </div>
            </div>

            {/* BACK OF ID CARD */}
            <div className="id-card-canvas w-[320px] flex flex-col bg-[#ffffff] relative border border-[#bec9c5]/30 rounded-xl shadow-sm overflow-hidden shrink-0">
              <div className="absolute inset-0 watermark-logo z-0"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-[#9e1a22] z-20"></div>

              <div className="flex-1 flex flex-col p-6 relative z-10">
                {/* Header Branding */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img alt="Droneco Logo" className="w-7 h-7 object-contain rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw0jj2rH3IHNc7ELhBvJqAoLGHSeMGVt4LwUtvNKhFN0Rwvis_W029eDPLkAiQzVUJHv3B7_zUbMC-atFp6GHm2JYc_qJmRfH54QGvn7mNVyFvC_kIvUiofXyhSKsj_wS188ZoBrJqruvo1UMqaGaF6TUpANsDEUty1E-fzBOhxaqfNvNv-oyuRdXAGXXMgtvN_Iy8j2TPQ1sZgqLd8Q0sII7UR953NMRxVd5HZeY3gWlFOVCbwCkIBFHKxjlI99nTSkk" />
                    <span className="text-[12px] text-[#004f45] font-bold tracking-tight uppercase">DRONECO INSTITUTE</span>
                  </div>
                  <span className="text-[#6e7976] font-bold uppercase tracking-[0.2em] text-[10px]">Back Panel</span>
                </div>

                {/* Section 1: Personal Info */}
                <section className="mb-4">
                  <h3 className="text-[#9e1a22] text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#9e1a22] rounded-full"></span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 px-1">
                    <div>
                      <p className="text-[9px] text-[#6e7976] font-bold uppercase">Father</p>
                      <p className="text-[14px] text-[#181c1b] font-semibold truncate">{fatherName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#6e7976] font-bold uppercase">Mother</p>
                      <p className="text-[14px] text-[#181c1b] font-semibold truncate">{motherName}</p>
                    </div>
                    <div className="col-span-2 mt-2 bg-[#9e1a22]/5 p-2 rounded border border-[#9e1a22]/20">
                      <p className="text-[9px] text-[#9e1a22] uppercase font-bold mb-1">Emergency Contact</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[14px] text-[#9e1a22] font-bold">{emergencyContact}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Residential Address */}
                <section className="mb-4">
                  <h3 className="text-[#9e1a22] text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#9e1a22] rounded-full"></span>
                    Residential Address
                  </h3>
                  <div className="bg-[#f1f4f2]/60 p-2 rounded-sm border-l-4 border-[#9e1a22]/30 mx-1">
                    <p className="text-[14px] text-[#4c616c] leading-relaxed line-clamp-2">
                      {address}
                    </p>
                  </div>
                </section>

                {/* Section 3: Institute Support */}
                <section className="mb-4">
                  <h3 className="text-[#9e1a22] text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#9e1a22] rounded-full"></span>
                    Institute Support
                  </h3>
                  <div className="space-y-1 bg-[#f1f4f2]/40 p-2 rounded-sm mx-1">
                    <div className="flex items-center gap-2 text-[#181c1b]">
                      <span className="text-[12px]">📞</span>
                      <span className="text-[13px]">+91 800 DRONECO</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#181c1b]">
                      <span className="text-[12px]">✉️</span>
                      <span className="text-[13px]">info@dronecoinstitute.com</span>
                    </div>
                  </div>
                </section>

                <div className="mt-auto mb-2">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className="text-[10px] text-[#6e7976] font-bold uppercase">Serial: {realStudentId}</span>
                    <span className="text-[10px] text-[#004f45] uppercase font-bold">Valid: JUNE {validTill}</span>
                  </div>
                  <div className="bg-white h-[76px] w-full flex items-center justify-between border border-[#bec9c5]/50 rounded-sm p-2 overflow-hidden shadow-inner">
                    <div className="shrink-0">
                      <QRCodeSVG value={realStudentId} size={54} level="M" />
                    </div>
                    <div className="flex-1 flex justify-end items-center h-full pl-2 border-l border-[#bec9c5]/30 ml-3">
                      <Barcode value={barcodeValue} height={44} displayValue={false} margin={0} width={2} background="transparent" />
                    </div>
                  </div>
                </div>

                {/* Rules & Disclaimer */}
                <section className="text-[9px] text-[#4c616c] leading-normal space-y-1 opacity-90 mb-2 border-t border-[#bec9c5]/30 pt-3">
                  <p><strong className="text-[#181c1b]">Conditions:</strong> This card is non-transferable and remains property of Droneco Institute. Present on demand to authorities.</p>
                  <p className="italic">If found, please return to any postal drop box or nearest Droneco Administrative Office.</p>
                </section>

                {/* Footer Branding */}
                <div className="flex items-center justify-between border-t border-[#9e1a22]/20 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <p className="text-[10px] text-[#004f45] font-bold uppercase">DRONECO INSTITUTE</p>
                    <p className="font-mono text-[8px] text-[#6e7976] uppercase tracking-wider">Certified Technology Board</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentIdCard;
