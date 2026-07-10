import React from 'react';

const StepPersonal = ({ formData, handleBasicChange, prevStep, nextStep }) => {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Personal & Communication Information
      </h2>

      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Personal Information
        </h3>

        <div className="form-group">
          <label className="form-label">Marital Status</label>
          <select
            name="marital_status"
            className="form-select"
            value={formData.marital_status}
            onChange={handleBasicChange}
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Identification Mark 1</label>
            <input
              type="text"
              name="identification_mark_1"
              className="form-input"
              value={formData.identification_mark_1}
              onChange={handleBasicChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Identification Mark 2</label>
            <input
              type="text"
              name="identification_mark_2"
              className="form-input"
              value={formData.identification_mark_2}
              onChange={handleBasicChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Disability Status</label>
            <select
              name="disability_status"
              className="form-select"
              value={formData.disability_status}
              onChange={handleBasicChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Disability Description (If applicable)</label>
            <input
              type="text"
              name="disability_description"
              className="form-input"
              value={formData.disability_description}
              onChange={handleBasicChange}
              disabled={formData.disability_status !== 'Yes'}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Communication Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Preferred Language</label>
            <input
              type="text"
              name="preferred_language"
              className="form-input"
              placeholder="e.g. ENGLISH, HINDI"
              value={formData.preferred_language}
              onChange={handleBasicChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <input
              type="tel"
              name="alternate_mobile"
              className="form-input"
              value={formData.alternate_mobile}
              onChange={handleBasicChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Personal Email (Optional)</label>
          <input
            type="email"
            name="personal_email"
            className="form-input"
            value={formData.personal_email}
            onChange={handleBasicChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepPersonal;
