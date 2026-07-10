import React from 'react';

const StepAddress = ({
  formData,
  handleNestedChange,
  prevStep,
  nextStep
}) => {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Address Details
      </h2>

      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Permanent Address
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">House/Flat No.</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.house_no}
              onChange={(e) => handleNestedChange('permanent_address', 'house_no', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Street/Locality</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.street}
              onChange={(e) => handleNestedChange('permanent_address', 'street', e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.city}
              onChange={(e) => handleNestedChange('permanent_address', 'city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">District</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.district}
              onChange={(e) => handleNestedChange('permanent_address', 'district', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.state}
              onChange={(e) => handleNestedChange('permanent_address', 'state', e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.country}
              onChange={(e) => handleNestedChange('permanent_address', 'country', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">PIN Code</label>
            <input
              type="text"
              className="form-input"
              value={formData.permanent_address.pin_code}
              onChange={(e) => handleNestedChange('permanent_address', 'pin_code', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Current Address
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontWeight: 400, color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.current_address.same_as_permanent}
              onChange={(e) => {
                const isChecked = e.target.checked;
                handleNestedChange('current_address', 'same_as_permanent', isChecked);
                if (isChecked) {
                  // Copy permanent to current
                  Object.keys(formData.permanent_address).forEach(key => {
                    handleNestedChange('current_address', key, formData.permanent_address[key]);
                  });
                }
              }}
              style={{ width: '16px', height: '16px' }}
            />
            Same as Permanent Address
          </label>
        </h3>

        {!formData.current_address.same_as_permanent && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">House/Flat No.</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.house_no}
                  onChange={(e) => handleNestedChange('current_address', 'house_no', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Street/Locality</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.street}
                  onChange={(e) => handleNestedChange('current_address', 'street', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.city}
                  onChange={(e) => handleNestedChange('current_address', 'city', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.district}
                  onChange={(e) => handleNestedChange('current_address', 'district', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.state}
                  onChange={(e) => handleNestedChange('current_address', 'state', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.country}
                  onChange={(e) => handleNestedChange('current_address', 'country', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_address.pin_code}
                  onChange={(e) => handleNestedChange('current_address', 'pin_code', e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepAddress;
