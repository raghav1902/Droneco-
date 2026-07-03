import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

const Step1 = ({ 
  currentStep, 
  setCurrentStep, 
  formData, 
  setFormData, 
  validationErrors, 
  handleBasicChange, 
  courses, 
  prevStep, 
  nextStep 
}) => {
  return (
    <>
      {/* STEP 0: Role Selection */}
      {currentStep === 0 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.010em' }}>
            Welcome to Droneco
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please select who is filling out this inquiry form:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* Student Card */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, filler_type: 'student' }));
                setCurrentStep(1);
              }}
              style={{
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: 'var(--bg-surface)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-hex)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--border))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--accent-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hex)',
                  fontSize: '1.2rem', fontWeight: 'bold'
                }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Student</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    I want to register for a course myself.
                  </p>
                </div>
              </div>
            </div>

            {/* Guardian Card */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, filler_type: 'guardian' }));
                setCurrentStep(1);
              }}
              style={{
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: 'var(--bg-surface)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-hex)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--border))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--accent-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hex)',
                  fontSize: '1.2rem', fontWeight: 'bold'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Parent / Guardian</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    I am registering details for my child/student.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Basic Details */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
            {formData.filler_type === 'guardian' ? 'Guardian & Student Info' : 'Basic Information'}
          </h2>

          {formData.filler_type === 'guardian' && (
            <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
                Guardian Details
              </h3>

              <div className="form-group">
                <label className="form-label">Guardian Name *</label>
                <input
                  type="text"
                  name="guardian_name"
                  className="form-input"
                  placeholder="e.g. Mr. Raj Sharma"
                  value={formData.guardian_name || ''}
                  onChange={handleBasicChange}
                />
                {validationErrors.guardian_name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Guardian Mobile *</label>
                  <input
                    type="tel"
                    name="guardian_phone"
                    className="form-input"
                    placeholder="Guardian's 10-digit number"
                    value={formData.guardian_phone || ''}
                    onChange={handleBasicChange}
                  />
                  {validationErrors.guardian_phone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <select
                    name="guardian_relation"
                    className="form-select"
                    value={formData.guardian_relation || ''}
                    onChange={handleBasicChange}
                  >
                    <option value="">Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                  {validationErrors.guardian_relation && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_relation}</span>}
                </div>
              </div>
            </div>
          )}

          {formData.filler_type === 'guardian' && (
            <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
              Student Details
            </h3>
          )}

          <div className="form-group">
            <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Full Name *" : 'Full Name *'}</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              placeholder="Student Name"
              value={formData.full_name}
              onChange={handleBasicChange}
            />
            {validationErrors.full_name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.full_name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Email (Optional)" : 'Email Address *'}</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="student@gmail.com"
              value={formData.email}
              onChange={handleBasicChange}
            />
            {validationErrors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.email}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Mobile (Optional)" : 'Mobile Number *'}</label>
              <input
                type="tel"
                name="mobile_number"
                className="form-input"
                placeholder="Student's number"
                value={formData.mobile_number}
                onChange={handleBasicChange}
              />
              {validationErrors.mobile_number && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.mobile_number}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="City"
                value={formData.city}
                onChange={handleBasicChange}
              />
              {validationErrors.city && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.city}</span>}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">Interested Course *</label>
            <select
              name="interested_course_id"
              className="form-select"
              value={formData.interested_course_id}
              onChange={handleBasicChange}
            >
              <option value="">-- Select a Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.course_name}</option>
              ))}
            </select>
            {validationErrors.interested_course_id && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.interested_course_id}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
            <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Step1;
