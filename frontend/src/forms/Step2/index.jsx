import React from 'react';

const Step2 = ({
  formData,
  validationErrors,
  questions,
  handleResponseChange,
  getCustomizedQuestionText,
  prevStep,
  nextStep
}) => {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Additional Details
      </h2>

      {questions.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No additional questions for this course. Click next to proceed.</p>
      ) : (
        questions.map(q => (
          <div key={q.id} className="form-group">
            <label className="form-label">{getCustomizedQuestionText(q.question_text)} {q.is_required && '*'}</label>

            {q.field_type === 'text' && (
              <input
                type="text"
                className="form-input"
                value={formData.responses[q.id] || ''}
                onChange={(e) => handleResponseChange(q.id, e.target.value)}
                placeholder={formData.filler_type === 'guardian' ? "Your student's answer..." : "Your answer..."}
              />
            )}

            {q.field_type === 'dropdown' && (
              <select
                className="form-select"
                value={formData.responses[q.id] || ''}
                onChange={(e) => handleResponseChange(q.id, e.target.value)}
              >
                <option value="">-- Select --</option>
                {q.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {q.field_type === 'radio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                {q.options.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      checked={formData.responses[q.id] === opt}
                      onChange={() => handleResponseChange(q.id, opt)}
                      style={{ accentColor: 'var(--accent-hex)' }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.field_type === 'checkbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                {q.options.map(opt => {
                  const currentValues = formData.responses[q.id] ? formData.responses[q.id].split(', ') : [];
                  const isChecked = currentValues.includes(opt);
                  const handleCheckboxChange = () => {
                    let newValues = isChecked
                      ? currentValues.filter(val => val !== opt)
                      : [...currentValues, opt];
                    handleResponseChange(q.id, newValues.join(', '));
                  };
                  return (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        style={{ accentColor: 'var(--accent-hex)' }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}

            {validationErrors[q.id] && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors[q.id]}</span>}
          </div>
        ))
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default Step2;
