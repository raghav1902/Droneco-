import React from 'react';

const StepAcademic = ({
  formData,
  handleNestedChange,
  prevStep,
  nextStep
}) => {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Academic Details
      </h2>

      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          Previous Qualification
        </h3>

        <div className="form-group">
          <label className="form-label">School / College Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.previous_qualification.school_college_name}
            onChange={(e) => handleNestedChange('previous_qualification', 'school_college_name', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Board / University</label>
            <input
              type="text"
              className="form-input"
              value={formData.previous_qualification.board_university}
              onChange={(e) => handleNestedChange('previous_qualification', 'board_university', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Passing Year</label>
            <input
              type="text"
              className="form-input"
              value={formData.previous_qualification.passing_year}
              onChange={(e) => handleNestedChange('previous_qualification', 'passing_year', e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Percentage / CGPA</label>
            <input
              type="text"
              className="form-input"
              value={formData.previous_qualification.percentage_cgpa}
              onChange={(e) => handleNestedChange('previous_qualification', 'percentage_cgpa', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              className="form-input"
              value={formData.previous_qualification.roll_number}
              onChange={(e) => handleNestedChange('previous_qualification', 'roll_number', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          10th Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Board</label>
            <input
              type="text"
              className="form-input"
              value={formData.tenth_details.board}
              onChange={(e) => handleNestedChange('tenth_details', 'board', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Percentage</label>
            <input
              type="text"
              className="form-input"
              value={formData.tenth_details.percentage}
              onChange={(e) => handleNestedChange('tenth_details', 'percentage', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Passing Year</label>
            <input
              type="text"
              className="form-input"
              value={formData.tenth_details.passing_year}
              onChange={(e) => handleNestedChange('tenth_details', 'passing_year', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
          12th Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Board</label>
            <input
              type="text"
              className="form-input"
              value={formData.twelfth_details.board}
              onChange={(e) => handleNestedChange('twelfth_details', 'board', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Percentage</label>
            <input
              type="text"
              className="form-input"
              value={formData.twelfth_details.percentage}
              onChange={(e) => handleNestedChange('twelfth_details', 'percentage', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Passing Year</label>
            <input
              type="text"
              className="form-input"
              value={formData.twelfth_details.passing_year}
              onChange={(e) => handleNestedChange('twelfth_details', 'passing_year', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepAcademic;
