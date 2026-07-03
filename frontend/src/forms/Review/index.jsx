import React from 'react';
import { Save } from 'lucide-react';

const Review = ({ formData, courses, questions, prevStep, handleSubmit, submitting }) => {
  const selectedCourse = courses.find(c => c.id === formData.interested_course_id);

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Review Submission
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {formData.filler_type === 'guardian' && (
          <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Guardian Details</h3>
            <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Name:</strong> {formData.guardian_name}</p>
            <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Relationship:</strong> {formData.guardian_relation}</p>
            <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Mobile:</strong> {formData.guardian_phone}</p>
          </div>
        )}

        <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            {formData.filler_type === 'guardian' ? 'Student Details' : 'Personal Details'}
          </h3>
          <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Student Name:</strong> {formData.full_name}</p>
          <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Email:</strong> {formData.email || 'N/A'}</p>
          <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Mobile:</strong> {formData.mobile_number || 'N/A'} | {formData.city}</p>
          <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Course:</strong> {selectedCourse ? selectedCourse.course_name : ''}</p>
        </div>

        {questions.length > 0 && (
          <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Additional Information</h3>
            {questions.map(q => (
              <p key={q.id} style={{ fontSize: '0.9rem', margin: '0.35rem 0' }}>
                <strong style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: 550 }}>{q.question_text}</strong>
                <span style={{ color: 'var(--text-main)' }}>{formData.responses[q.id] || 'N/A'}</span>
              </p>
            ))}
          </div>
        )}

        <div>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Feedback</h3>
          <p style={{ fontSize: '0.95rem' }}><strong style={{ fontWeight: 550 }}>Source:</strong> {formData.feedback.source} | <strong style={{ fontWeight: 550 }}>Rating:</strong> {formData.feedback.rating}/5</p>
          {formData.feedback.comments && <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginTop: '0.25rem' }}>"{formData.feedback.comments}"</p>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep} disabled={submitting}>&larr; Back</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {submitting ? 'Submitting...' : <><Save size={18} /> Submit Inquiry</>}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Review;
