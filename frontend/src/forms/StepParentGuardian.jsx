import React from 'react';
import CustomFieldsRenderer from './CustomFieldsRenderer';

const StepParentGuardian = ({ formData, handleNestedChange, validationErrors, prevStep, nextStep, formConfig }) => {
  const getError = (section, field) => validationErrors[`${section}.${field}`];

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Parent / Guardian Details
      </h2>

      {/* FATHER DETAILS */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>👨 Father Details</h3>
        
        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.father.first_name}
              onChange={(e) => handleNestedChange('father', 'first_name', e.target.value)}
            />
            {getError('father', 'first_name') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'first_name')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.father.middle_name}
              onChange={(e) => handleNestedChange('father', 'middle_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.father.last_name}
              onChange={(e) => handleNestedChange('father', 'last_name', e.target.value)}
            />
            {getError('father', 'last_name') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'last_name')}</span>}
          </div>
        </div>

        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.father.mobile_number}
              onChange={(e) => handleNestedChange('father', 'mobile_number', e.target.value)}
            />
            {getError('father', 'mobile_number') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'mobile_number')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="tel"
              className="form-input"
              value={formData.father.alt_mobile_number}
              onChange={(e) => handleNestedChange('father', 'alt_mobile_number', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="email"
              className="form-input"
              value={formData.father.email}
              onChange={(e) => handleNestedChange('father', 'email', e.target.value)}
            />
            {getError('father', 'email') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'email')}</span>}
          </div>
        </div>

        <div className='form-grid-2'>
          <div className="form-group">
            <label className="form-label">Occupation *</label>
            <select
              className="form-select"
              value={formData.father.occupation}
              onChange={(e) => handleNestedChange('father', 'occupation', e.target.value)}
            >
              <option value="">Select Occupation</option>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Business">Business</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>
            {getError('father', 'occupation') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'occupation')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Organization / Company Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.father.organization}
              onChange={(e) => handleNestedChange('father', 'organization', e.target.value)}
            />
          </div>
        </div>

        <div className='form-grid-2'>
          <div className="form-group">
            <label className="form-label">Annual Income (₹) <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="number"
              className="form-input"
              value={formData.father.annual_income}
              onChange={(e) => handleNestedChange('father', 'annual_income', e.target.value)}
            />
            {getError('father', 'annual_income') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('father', 'annual_income')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Highest Qualification <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select
              className="form-select"
              value={formData.father.highest_qualification}
              onChange={(e) => handleNestedChange('father', 'highest_qualification', e.target.value)}
            >
              <option value="">Select Qualification</option>
              <option value="Below 10th">Below 10th</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOTHER DETAILS */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>👩 Mother Details</h3>
        
        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.mother.first_name}
              onChange={(e) => handleNestedChange('mother', 'first_name', e.target.value)}
            />
            {getError('mother', 'first_name') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('mother', 'first_name')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.mother.middle_name}
              onChange={(e) => handleNestedChange('mother', 'middle_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.mother.last_name}
              onChange={(e) => handleNestedChange('mother', 'last_name', e.target.value)}
            />
            {getError('mother', 'last_name') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('mother', 'last_name')}</span>}
          </div>
        </div>

        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.mother.mobile_number}
              onChange={(e) => handleNestedChange('mother', 'mobile_number', e.target.value)}
            />
            {getError('mother', 'mobile_number') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('mother', 'mobile_number')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="tel"
              className="form-input"
              value={formData.mother.alt_mobile_number}
              onChange={(e) => handleNestedChange('mother', 'alt_mobile_number', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="email"
              className="form-input"
              value={formData.mother.email}
              onChange={(e) => handleNestedChange('mother', 'email', e.target.value)}
            />
            {getError('mother', 'email') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('mother', 'email')}</span>}
          </div>
        </div>

        <div className='form-grid-2'>
          <div className="form-group">
            <label className="form-label">Occupation <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select
              className="form-select"
              value={formData.mother.occupation}
              onChange={(e) => handleNestedChange('mother', 'occupation', e.target.value)}
            >
              <option value="">Select Occupation</option>
              <option value="Housewife">Housewife</option>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Business">Business</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Organization / Company Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.mother.organization}
              onChange={(e) => handleNestedChange('mother', 'organization', e.target.value)}
            />
          </div>
        </div>

        <div className='form-grid-2'>
          <div className="form-group">
            <label className="form-label">Annual Income (₹) <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="number"
              className="form-input"
              value={formData.mother.annual_income}
              onChange={(e) => handleNestedChange('mother', 'annual_income', e.target.value)}
            />
            {getError('mother', 'annual_income') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('mother', 'annual_income')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Highest Qualification <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select
              className="form-select"
              value={formData.mother.highest_qualification}
              onChange={(e) => handleNestedChange('mother', 'highest_qualification', e.target.value)}
            >
              <option value="">Select Qualification</option>
              <option value="Below 10th">Below 10th</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
        </div>
      </div>

      {/* GUARDIAN DETAILS */}
      {formData.filler_type !== 'guardian' && formConfig?.guardian?.visible !== false && (
      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>👨👩👧 Guardian Details {formConfig?.guardian?.required ? '*' : '(If Applicable)'}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Fill only if living with a guardian or different from parents.</p>
        
        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">First Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.guardian.first_name}
              onChange={(e) => handleNestedChange('guardian', 'first_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.guardian.middle_name}
              onChange={(e) => handleNestedChange('guardian', 'middle_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.guardian.last_name}
              onChange={(e) => handleNestedChange('guardian', 'last_name', e.target.value)}
            />
          </div>
        </div>

        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">Relationship with Student <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select
              className="form-select"
              value={formData.guardian.relationship}
              onChange={(e) => handleNestedChange('guardian', 'relationship', e.target.value)}
            >
              <option value="">Select Relationship</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Uncle">Uncle</option>
              <option value="Aunt">Aunt</option>
              <option value="Grandfather">Grandfather</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="tel"
              className="form-input"
              value={formData.guardian.mobile_number}
              onChange={(e) => handleNestedChange('guardian', 'mobile_number', e.target.value)}
            />
            {getError('guardian', 'mobile_number') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('guardian', 'mobile_number')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="email"
              className="form-input"
              value={formData.guardian.email}
              onChange={(e) => handleNestedChange('guardian', 'email', e.target.value)}
            />
             {getError('guardian', 'email') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('guardian', 'email')}</span>}
          </div>
        </div>

        <div className='form-grid-1-2'>
          <div className="form-group">
            <label className="form-label">Occupation <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.guardian.occupation}
              onChange={(e) => handleNestedChange('guardian', 'occupation', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.guardian.address}
              onChange={(e) => handleNestedChange('guardian', 'address', e.target.value)}
            />
          </div>
        </div>
      </div>
      )}

      {/* EMERGENCY CONTACT */}
      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--danger)', marginBottom: '1.5rem', fontWeight: 600 }}>🚨 Emergency Contact</h3>
        
        <div className='form-grid-3'>
          <div className="form-group">
            <label className="form-label">Emergency Contact Person Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.emergency_contact.name}
              onChange={(e) => handleNestedChange('emergency_contact', 'name', e.target.value)}
            />
            {getError('emergency_contact', 'name') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('emergency_contact', 'name')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Relationship with Student *</label>
            <select
              className="form-select"
              value={formData.emergency_contact.relationship}
              onChange={(e) => handleNestedChange('emergency_contact', 'relationship', e.target.value)}
            >
              <option value="">Select Relationship</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
            {getError('emergency_contact', 'relationship') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('emergency_contact', 'relationship')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Emergency Mobile Number *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.emergency_contact.mobile_number}
              onChange={(e) => handleNestedChange('emergency_contact', 'mobile_number', e.target.value)}
            />
            {getError('emergency_contact', 'mobile_number') && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{getError('emergency_contact', 'mobile_number')}</span>}
          </div>
        </div>
      </div>

      <CustomFieldsRenderer
        stepName="ParentGuardian"
        formConfig={formConfig}
        formData={formData}
        handleBasicChange={(e) => handleNestedChange('customFields', e.target.name, e.target.value)} // Need to adjust this for handleBasicChange if custom fields are top level
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepParentGuardian;
