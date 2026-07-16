import React from 'react';

const Step1 = ({
  formData,
  validationErrors,
  handleBasicChange,
  nextStep
}) => {
  return (
    <div className="animate-slide-up-fade">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            name="full_name"
            className="form-input"
            placeholder="First Name"
            value={formData.full_name}
            onChange={handleBasicChange}
          />
          {validationErrors.full_name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.full_name}</span>}
        </div>



        <div className="form-group">
          <label className="form-label">Last Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <input
            type="text"
            name="last_name"
            className="form-input"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleBasicChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Date of Birth <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <input
            type="date"
            name="dob"
            className="form-input"
            value={formData.dob}
            onChange={handleBasicChange}
          />
          {validationErrors.dob && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.dob}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Mobile Number *</label>
          <input
            type="tel"
            name="mobile_number"
            className="form-input"
            placeholder="Mobile number"
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default Step1;
