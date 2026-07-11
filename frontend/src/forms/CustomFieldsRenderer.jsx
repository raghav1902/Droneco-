import React from 'react';

const CustomFieldsRenderer = ({ stepName, formConfig, formData, handleBasicChange }) => {
  if (!formConfig?.customFields || formConfig.customFields.length === 0) return null;

  const fieldsForStep = formConfig.customFields.filter(field => field.step === stepName);
  if (fieldsForStep.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-hex)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
        Additional Details
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {fieldsForStep.map(field => (
          <div key={field.id} className="form-group" style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
            <label className="form-label">{field.label} {field.required ? '*' : ''}</label>
            {field.type === 'dropdown' ? (
              <select
                name={field.id}
                className="form-select"
                value={formData[field.id] || ''}
                onChange={handleBasicChange}
              >
                <option value="">Select...</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.id}
                className="form-textarea"
                rows="3"
                value={formData[field.id] || ''}
                onChange={handleBasicChange}
              ></textarea>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                name={field.id}
                className="form-input"
                value={formData[field.id] || ''}
                onChange={handleBasicChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsRenderer;
