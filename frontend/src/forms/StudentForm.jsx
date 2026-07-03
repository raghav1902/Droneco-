import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import API from '../api/api';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Review from './Review';
import Success from './Success';

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

    // Auto-detect role from URL parameters
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

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="wizard-layout" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <button
          onClick={handleToggleTheme}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid hsl(var(--border))',
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
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-hex)', fontWeight: 600 }}>
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
                  backgroundColor: currentStep >= step ? 'var(--accent-hex)' : 'hsl(var(--border))',
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

          {(currentStep === 0 || currentStep === 1) && (
            <Step1 
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              handleBasicChange={handleBasicChange}
              courses={courses}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2 
              formData={formData}
              validationErrors={validationErrors}
              questions={questions}
              handleResponseChange={handleResponseChange}
              getCustomizedQuestionText={getCustomizedQuestionText}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 3 && (
            <Step3 
              formData={formData}
              handleFeedbackChange={handleFeedbackChange}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 4 && (
            <Review 
              formData={formData}
              courses={courses}
              questions={questions}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

          {currentStep === 5 && (
            <Success 
              formData={formData}
              setCurrentStep={setCurrentStep}
              setFormData={setFormData}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentForm;
