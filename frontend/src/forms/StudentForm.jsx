/**
 * @file StudentForm.jsx
 * @description Multi-step lead acquisition wizard for prospective students.
 */

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Users, CheckCircle, Save, Check, GraduationCap, Star } from 'lucide-react';
import API from '../api/api';

const StudentForm = () => {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Theme State
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-theme'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    } else {
      document.body.classList.remove('dark-theme');
      setIsDark(false);
    }
  }, []);

  const handleToggleTheme = () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    filler_type: 'student', // 'student' or 'guardian'
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    full_name: '',
    email: '',
    mobile_number: '',
    city: '',
    interested_course_id: '',
    responses: {}, // question_id -> response_value
    feedback: {
      rating: 5,
      source: 'Google Search',
      comments: ''
    }
  });

  // Validation Errors per step
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchFormMetadata = async () => {
      try {
        const [coursesRes, questionsRes] = await Promise.all([
          API.get('/courses'),
          API.get('/questions')
        ]);
        setCourses(coursesRes.data.data);
        setQuestions(questionsRes.data.data);
      } catch (err) {
        console.error('Error fetching form metadata:', err);
        setError('Failed to load form settings. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchFormMetadata();

    // Auto-detect role from URL parameters (e.g. from customized QR codes)
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'guardian') {
      setFormData(prev => ({ ...prev, filler_type: 'guardian' }));
      setCurrentStep(1);
    } else if (roleParam === 'student') {
      setFormData(prev => ({ ...prev, filler_type: 'student' }));
      setCurrentStep(1);
    }
  }, []);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleResponseChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value }
    }));
    if (validationErrors[questionId]) {
      setValidationErrors(prev => ({ ...prev, [questionId]: null }));
    }
  };

  const handleFeedbackChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      feedback: { ...prev.feedback, [field]: value }
    }));
  };

  // Validate Step 1
  const validateStep1 = () => {
    const errors = {};

    if (formData.filler_type === 'guardian') {
      // Validate guardian details
      if (!formData.guardian_name || !formData.guardian_name.trim()) {
        errors.guardian_name = 'Guardian Name is required';
      }
      if (!formData.guardian_phone || !formData.guardian_phone.trim()) {
        errors.guardian_phone = 'Guardian Mobile is required';
      } else if (!/^\d{10}$/.test(formData.guardian_phone.replace(/[-+ ]/g, ''))) {
        errors.guardian_phone = 'Enter a valid 10-digit mobile number';
      }
      if (!formData.guardian_relation) {
        errors.guardian_relation = 'Relationship is required';
      }

      // Validate student details
      if (!formData.full_name.trim()) {
        errors.full_name = "Student's Full Name is required";
      }
      if (formData.email && formData.email.trim()) {
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Invalid email format';
        }
      }
      if (formData.mobile_number && formData.mobile_number.trim()) {
        if (!/^\d{10}$/.test(formData.mobile_number.replace(/[-+ ]/g, ''))) {
          errors.mobile_number = 'Enter a valid 10-digit mobile number';
        }
      }
    } else {
      // Validate student details (Standard)
      if (!formData.full_name.trim()) errors.full_name = 'Full Name is required';
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      if (!formData.mobile_number.trim()) {
        errors.mobile_number = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobile_number.replace(/[-+ ]/g, ''))) {
        errors.mobile_number = 'Enter a valid 10-digit mobile number';
      }
    }

    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.interested_course_id) errors.interested_course_id = 'Please select a course';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 2 (Dynamic Questions)
  const validateStep2 = () => {
    const errors = {};
    questions.forEach(q => {
      if (q.is_required && !formData.responses[q.id]) {
        errors[q.id] = 'This field is required';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const responsesArray = Object.keys(formData.responses).map(qId => ({
        question_id: qId,
        response_value: formData.responses[qId]
      }));

      const payload = {
        ...formData,
        responses: responsesArray
      };

      await API.post('/leads', payload);
      setCurrentStep(5); // Show success step
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const selectedCourse = courses.find(c => c.id === formData.interested_course_id);

  const getCustomizedQuestionText = (text) => {
    if (formData.filler_type !== 'guardian') return text;
    let customized = text;
    customized = customized.replace(/your highest educational qualification/gi, "your student's highest educational qualification");
    customized = customized.replace(/Do you have any prior programming experience/gi, "Does your student have any prior programming experience");
    customized = customized.replace(/your primary goal/gi, "your student's primary goal");

    if (customized === text) {
      customized = customized
        .replace(/\byour\b/gi, "your student's")
        .replace(/\bDo you\b/gi, "Does your student")
        .replace(/\byou\b/gi, "your student");
    }
    return customized;
  };

  return (
    <div className="wizard-layout" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <button
          onClick={handleToggleTheme}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
            outline: 'none'
          }}
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {/* Left Column: Asymmetric Intro Panel */}
      <div className="intro-panel">
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', fontWeight: 600 }}>
            Inquiry Registration
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: '1rem', lineHeight: '1.2', fontWeight: 400 }}>
            Droneco <br />Coaching Institute
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', maxWidth: '360px', fontSize: '1rem', lineHeight: '1.6' }}>
            {currentStep === 5
              ? 'Your inquiry is complete. Thank you for choosing Droneco.'
              : currentStep === 0
                ? 'Welcome to Droneco. Please select who is filling out this form to customize your registration experience.'
                : 'Please complete this form to register details. One of our advisors will contact you shortly.'}
          </p>
        </div>

        {/* Subtle Step Tracker */}
        {currentStep >= 1 && currentStep <= 4 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step <strong style={{ color: 'var(--text-main)' }}>{currentStep}</strong> of 4
            </div>
            <div style={{ display: 'flex', gap: '6px', width: '160px' }}>
              {[1, 2, 3, 4].map(step => (
                <div key={step} style={{
                  height: '3px',
                  flex: 1,
                  backgroundColor: currentStep >= step ? 'var(--accent)' : 'var(--border)',
                  transition: 'background-color 0.3s ease'
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="form-panel">
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {error && (
            <div style={{ background: 'var(--danger-glow)', border: '1px solid rgba(190, 18, 60, 0.15)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* STEP 0: Role Selection */}
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.010em' }}>
                Welcome to Droneco
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Please select who is filling out this inquiry form:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {/* Student Card */}
                <div
                  onClick={() => {
                    setFormData(prev => ({ ...prev, filler_type: 'student' }));
                    setCurrentStep(1);
                  }}
                  style={{
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    background: 'var(--bg-surface)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--accent-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                      fontSize: '1.2rem', fontWeight: 'bold'
                    }}>
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Student</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        I want to register for a course myself.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guardian Card */}
                <div
                  onClick={() => {
                    setFormData(prev => ({ ...prev, filler_type: 'guardian' }));
                    setCurrentStep(1);
                  }}
                  style={{
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    background: 'var(--bg-surface)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--accent-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                      fontSize: '1.2rem', fontWeight: 'bold'
                    }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>I am a Parent / Guardian</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        I am registering details for my child/student.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Basic Details */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
                {formData.filler_type === 'guardian' ? 'Guardian & Student Info' : 'Basic Information'}
              </h2>

              {formData.filler_type === 'guardian' && (
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
                    Guardian Details
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Guardian Name *</label>
                    <input
                      type="text"
                      name="guardian_name"
                      className="form-input"
                      placeholder="e.g. Mr. Raj Sharma"
                      value={formData.guardian_name || ''}
                      onChange={handleBasicChange}
                    />
                    {validationErrors.guardian_name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_name}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Guardian Mobile *</label>
                      <input
                        type="tel"
                        name="guardian_phone"
                        className="form-input"
                        placeholder="Guardian's 10-digit number"
                        value={formData.guardian_phone || ''}
                        onChange={handleBasicChange}
                      />
                      {validationErrors.guardian_phone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_phone}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Relationship *</label>
                      <select
                        name="guardian_relation"
                        className="form-select"
                        value={formData.guardian_relation || ''}
                        onChange={handleBasicChange}
                      >
                        <option value="">Relation</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                      {validationErrors.guardian_relation && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.guardian_relation}</span>}
                    </div>
                  </div>
                </div>
              )}

              {formData.filler_type === 'guardian' && (
                <h3 style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
                  Student Details
                </h3>
              )}

              <div className="form-group">
                <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Full Name *" : 'Full Name *'}</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  placeholder="Student Name"
                  value={formData.full_name}
                  onChange={handleBasicChange}
                />
                {validationErrors.full_name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.full_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Email (Optional)" : 'Email Address *'}</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{formData.filler_type === 'guardian' ? "Student's Mobile (Optional)" : 'Mobile Number *'}</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    className="form-input"
                    placeholder="Student's number"
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

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="form-label">Interested Course *</label>
                <select
                  name="interested_course_id"
                  className="form-select"
                  value={formData.interested_course_id}
                  onChange={handleBasicChange}
                >
                  <option value="">-- Select a Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.course_name}</option>
                  ))}
                </select>
                {validationErrors.interested_course_id && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{validationErrors.interested_course_id}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={prevStep}>&larr; Back</button>
                <button className="btn btn-primary" onClick={nextStep}>Next Step &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 2: Dynamic Questions */}
          {currentStep === 2 && (
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
                              style={{ accentColor: 'var(--accent)' }}
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
                                style={{ accentColor: 'var(--accent)' }}
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
          )}

          {/* STEP 3: Feedback */}
          {currentStep === 3 && (
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
          )}

          {/* STEP 4: Review Details */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.25rem', letterSpacing: '-0.010em' }}>
                Review Submission
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {formData.filler_type === 'guardian' && (
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Guardian Details</h3>
                    <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Name:</strong> {formData.guardian_name}</p>
                    <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Relationship:</strong> {formData.guardian_relation}</p>
                    <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Mobile:</strong> {formData.guardian_phone}</p>
                  </div>
                )}

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    {formData.filler_type === 'guardian' ? 'Student Details' : 'Personal Details'}
                  </h3>
                  <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Student Name:</strong> {formData.full_name}</p>
                  <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Email:</strong> {formData.email || 'N/A'}</p>
                  <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Mobile:</strong> {formData.mobile_number || 'N/A'} | {formData.city}</p>
                  <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><strong style={{ fontWeight: 550 }}>Course:</strong> {selectedCourse ? selectedCourse.course_name : ''}</p>
                </div>

                {questions.length > 0 && (
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Additional Information</h3>
                    {questions.map(q => (
                      <p key={q.id} style={{ fontSize: '0.9rem', margin: '0.35rem 0' }}>
                        <strong style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: 550 }}>{q.question_text}</strong>
                        <span style={{ color: 'var(--text-main)' }}>{formData.responses[q.id] || 'N/A'}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Feedback</h3>
                  <p style={{ fontSize: '0.95rem' }}><strong style={{ fontWeight: 550 }}>Source:</strong> {formData.feedback.source} | <strong style={{ fontWeight: 550 }}>Rating:</strong> {formData.feedback.rating}/5</p>
                  {formData.feedback.comments && <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginTop: '0.25rem' }}>"{formData.feedback.comments}"</p>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={prevStep} disabled={submitting}>&larr; Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {submitting ? 'Submitting...' : <><Save size={18} /> Submit Inquiry</>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success Page */}
          {currentStep === 5 && (
            <div className="animate-fade-in" style={{ textAlign: 'left' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--success-glow)',
                border: '1px solid var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                fontSize: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <Check size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Inquiry Registered</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {formData.filler_type === 'guardian' ? (
                  <>
                    Thank you, <strong>{formData.guardian_name}</strong>. Your student's details have been successfully saved.
                    Our team will reach out to you on <strong>{formData.guardian_phone}</strong> shortly.
                  </>
                ) : (
                  <>
                    Thank you, <strong>{formData.full_name}</strong>. Your details have been successfully saved.
                    Our team will reach out to you on <strong>{formData.mobile_number}</strong> shortly.
                  </>
                )}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => {
                    setFormData({
                      filler_type: 'student',
                      guardian_name: '',
                      guardian_relation: '',
                      guardian_phone: '',
                      full_name: '',
                      email: '',
                      mobile_number: '',
                      city: '',
                      interested_course_id: '',
                      responses: {},
                      feedback: {
                        rating: 5,
                        source: 'Google Search',
                        comments: ''
                      }
                    });
                    setCurrentStep(0);
                  }}
                >
                  Register Another Student
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
