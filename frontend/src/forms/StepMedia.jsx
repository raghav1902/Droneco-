import React, { useState } from 'react';
import API from '../api/api';

const StepMedia = ({ formData, handleBasicChange, prevStep, nextStep, validationErrors, formConfig }) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);

  const handleFileUpload = async (e, fieldName, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await API.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        handleBasicChange({ target: { name: fieldName, value: res.data.url } });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
        Student Photo & Signature
      </h2>

      {formConfig?.media?.visible !== false && (
        <>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Upload Passport Size Photograph {formConfig?.media?.required ? '*' : ''}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={(e) => handleFileUpload(e, 'photo_url', setUploadingPhoto)}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto && <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>}
            </div>
            {formData.photo_url && (
              <div style={{ marginTop: '1rem' }}>
                <img src={`http://localhost:5000${formData.photo_url}`} alt="Student Photo" style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
              </div>
            )}
            {validationErrors.photo_url && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.photo_url}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">Upload Student Signature {formConfig?.media?.required ? '*' : ''}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={(e) => handleFileUpload(e, 'signature_url', setUploadingSig)}
                disabled={uploadingSig}
              />
              {uploadingSig && <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>}
            </div>
            {formData.signature_url && (
              <div style={{ marginTop: '1rem' }}>
                <img src={`http://localhost:5000${formData.signature_url}`} alt="Signature" style={{ height: '60px', borderRadius: '4px', objectFit: 'contain', background: '#fff', padding: '4px' }} />
              </div>
            )}
            {validationErrors.signature_url && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.signature_url}</span>}
          </div>
        </>
      )}

      {formConfig?.media?.visible === false && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Photo and signature are not required.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
        <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
      </div>
    </div>
  );
};

export default StepMedia;
