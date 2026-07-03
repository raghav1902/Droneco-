import React from 'react';
import { Check } from 'lucide-react';

const Success = ({ formData, setCurrentStep, setFormData }) => {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--success-glow)',
        border: '1px solid var(--success)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--success)',
        fontSize: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <Check size={48} />
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Inquiry Registered</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
        {formData.filler_type === 'guardian' ? (
          <>
            Thank you, <strong>{formData.guardian_name}</strong>. Your student's details have been successfully saved.
            Our team will reach out to you on <strong>{formData.guardian_phone}</strong> shortly.
          </>
        ) : (
          <>
            Thank you, <strong>{formData.full_name}</strong>. Your details have been successfully saved.
            Our team will reach out to you on <strong>{formData.mobile_number}</strong> shortly.
          </>
        )}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '2rem' }}>
        <button
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => {
            setFormData({
              filler_type: 'student',
              guardian_name: '',
              guardian_relation: '',
              guardian_phone: '',
              full_name: '',
              email: '',
              mobile_number: '',
              city: '',
              interested_course_id: '',
              responses: {},
              feedback: {
                rating: 5,
                source: 'Google Search',
                comments: ''
              }
            });
            setCurrentStep(0);
          }}
        >
          Register Another Student
        </button>
      </div>
    </div>
  );
};

export default Success;
