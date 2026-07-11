import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import API from '../api/api';
import { createLeadSchema, step1Schema, validateForm } from '../utils/validators';

import Step1 from './Step1';
import StepPersonal from './StepPersonal';
import StepParentGuardian from './StepParentGuardian';
import StepAddress from './StepAddress';
import StepAcademic from './StepAcademic';
import StepCourse from './StepCourse';
import StepMedia from './StepMedia';
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
    filler_type: 'student',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    full_name: '',
    middle_name: '',
    last_name: '',
    photo_url: '',
    signature_url: '',
    gender: '',
    dob: '',
    blood_group: '',
    nationality: 'Indian',
    category: '',
    religion: '',
    aadhaar_number: '',
    email: '',
    mobile_number: '',
    city: '',
    marital_status: '',
    identification_mark_1: '',
    identification_mark_2: '',
    disability_status: 'No',
    disability_description: '',
    preferred_language: '',
    alternate_mobile: '',
    personal_email: '',
    father: {
      first_name: '', middle_name: '', last_name: '', mobile_number: '', alt_mobile_number: '', email: '', occupation: '', organization: '', annual_income: '', highest_qualification: ''
    },
    mother: {
      first_name: '', middle_name: '', last_name: '', mobile_number: '', alt_mobile_number: '', email: '', occupation: '', organization: '', annual_income: '', highest_qualification: ''
    },
    guardian: {
      first_name: '', middle_name: '', last_name: '', relationship: '', mobile_number: '', email: '', occupation: '', address: ''
    },
    emergency_contact: {
      name: '', relationship: '', mobile_number: ''
    },
    permanent_address: {
      house_no: '', street: '', city: '', district: '', state: '', country: 'India', pin_code: ''
    },
    current_address: {
      same_as_permanent: false, house_no: '', street: '', city: '', district: '', state: '', country: 'India', pin_code: ''
    },
    previous_qualification: {
      school_college_name: '', board_university: '', passing_year: '', percentage_cgpa: '', roll_number: ''
    },
    tenth_details: { percentage: '', board: '', passing_year: '' },
    twelfth_details: { percentage: '', board: '', passing_year: '' },
    admission_year: new Date().getFullYear().toString(),
    department: '',
    branch: '',
    semester: '',
    section: '',
    roll_number: '',
    student_id: '',
    mode_of_admission: '',
    interested_course_id: '',
    responses: {},
    feedback: {
      rating: 5,
      source: 'Google Search',
      comments: ''
    }
  });

  // Validation Errors per step
  const [validationErrors, setValidationErrors] = useState({});

  // Form Configuration State
  const [formConfig, setFormConfig] = useState({});

  useEffect(() => {
    const fetchFormMetadata = async () => {
      try {
        const [coursesRes, questionsRes, settingsRes] = await Promise.all([
          API.get('/courses'),
          API.get('/questions'),
          API.get('/settings/public')
        ]);
        setCourses(coursesRes.data.data);
        setQuestions(questionsRes.data.data);
        if (settingsRes.data.success && settingsRes.data.data.formConfig) {
          setFormConfig(settingsRes.data.data.formConfig);
        }
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

  const toTitleCase = (str) => {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleBasicChange = (e) => {
    let { name, value } = e.target;
    // Auto-capitalize specific fields to Title Case
    if (['full_name', 'first_name', 'middle_name', 'last_name', 'guardian_name', 'identification_mark_1', 'identification_mark_2', 'preferred_language', 'city', 'name'].includes(name)) {
      value = toTitleCase(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    let finalValue = value;
    if (['first_name', 'middle_name', 'last_name', 'name', 'city', 'street'].includes(field) && typeof value === 'string') {
      finalValue = toTitleCase(value);
    }
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: finalValue
      }
    }));
    if (validationErrors[`${section}.${field}`]) {
      setValidationErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
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
    const result = validateForm(step1Schema, formData);
    if (!result.success) {
      setValidationErrors(result.errors);
      return false;
    }
    setValidationErrors({});
    return true;
  };

  // Validate other steps if needed (simplifying for now)
  const validateStep2Dynamic = () => {
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
    if (currentStep === 8 && !validateStep2Dynamic()) return; // questions step is now 8
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate everything one last time
      const finalValidation = validateForm(createLeadSchema, formData);
      if (!finalValidation.success) {
        setValidationErrors(finalValidation.errors);
        setError('Please fix the errors in the form before submitting.');
        setSubmitting(false);
        return;
      }

      // Create a clean payload with only necessary fields
      const payload = {
        ...formData
      };

      await API.post('/leads', payload);
      setCurrentStep(11); // Show success step
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
            {currentStep === 11
              ? 'Your inquiry is complete. Thank you for choosing Droneco.'
              : currentStep === 0
                ? 'Welcome to Droneco. Please select who is filling out this form to customize your registration experience.'
                : 'Please complete this form to register details. One of our advisors will contact you shortly.'}
          </p>
        </div>

        {/* Subtle Step Tracker */}
        {currentStep >= 1 && currentStep <= 10 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step <strong style={{ color: 'var(--text-main)' }}>{currentStep}</strong> of 10
            </div>
            <div style={{ display: 'flex', gap: '6px', width: '220px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
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
              handleNestedChange={handleNestedChange}
              courses={courses}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 2 && (
            <StepPersonal
              formData={formData}
              handleBasicChange={handleBasicChange}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 3 && (
            <StepParentGuardian
              formData={formData}
              handleNestedChange={handleNestedChange}
              validationErrors={validationErrors}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 4 && (
            <StepAddress
              formData={formData}
              handleNestedChange={handleNestedChange}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 5 && (
            <StepAcademic
              formData={formData}
              handleNestedChange={handleNestedChange}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 6 && (
            <StepCourse
              formData={formData}
              handleBasicChange={handleBasicChange}
              courses={courses}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 7 && (
            <StepMedia
              formData={formData}
              handleBasicChange={handleBasicChange}
              validationErrors={validationErrors}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 8 && (
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

          {currentStep === 9 && (
            <Step3
              formData={formData}
              handleFeedbackChange={handleFeedbackChange}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 10 && (
            <Review
              formData={formData}
              courses={courses}
              questions={questions}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

          {currentStep === 11 && (
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
