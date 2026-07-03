import React from 'react';

const Step3 = ({ formData, handleFeedbackChange, prevStep, nextStep }) => {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Your Feedback
      </h2>

      <div className="form-group">
        <label className="form-label">How did you hear about us?</label>
        <select
          className="form-select"
          value={formData.feedback.source}
          onChange={(e) => handleFeedbackChange('source', e.target.value)}
        >
          <option value="Google Search">Google Search</option>
          <option value="Social Media">Social Media</option>
          <option value="Friend Recommendation">Friend / Recommendation</option>
          <option value="Newspaper / Flyer">Newspaper / Flyer</option>
          <option value="QR Poster">QR Code Poster</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Rate your registration experience</label>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => handleFeedbackChange('rating', star)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.75rem',
                color: star <= formData.feedback.rating ? '#d97706' : '#cbd5e1',
                transition: 'color 0.1s ease'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <label className="form-label">Any specific queries or remarks? (Optional)</label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Ask about placement assistance, batch timings, etc..."
          value={formData.feedback.comments}
          onChange={(e) => handleFeedbackChange('comments', e.target.value)}
        ></textarea>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Review &rarr;</button>
      </div>
    </div>
  );
};

export default Step3;
