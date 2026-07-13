import React from 'react';
import CustomFieldsRenderer from './CustomFieldsRenderer';

const StepPersonal = ({ formData, handleBasicChange, prevStep, nextStep, formConfig }) => {
  return (
    <div className="animate-slide-up-fade">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Personal & Communication Information
      </h2>

      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Personal Information
        </h3>



        {formConfig?.disability?.visible !== false && (
          <div className='form-grid-1-2'>
            <div className="form-group">
              <label className="form-label">Disability Status {formConfig?.disability?.required ? '*' : ''}</label>
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
              <label className="form-label">Disability Description (If applicable) <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
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
        )}
      </div>

      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Communication Information
        </h3>

        <div className='form-grid-2'>
          <div className="form-group">
            <label className="form-label">Preferred Language <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
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
            <label className="form-label">Alternate Mobile Number <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
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

      <CustomFieldsRenderer
        stepName="Personal"
        formConfig={formConfig}
        formData={formData}
        handleBasicChange={handleBasicChange}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepPersonal;
