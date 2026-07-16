import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import API from '../api/api';
import { createLeadSchema, step1Schema, validateForm } from '../utils/validators';

import Step0 from './Step0';
import Step1 from './Step1';

import StepCourse from './StepCourse';
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
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
      setIsDark(false);
    }
  }, []);

  const handleToggleTheme = () => {
    if (document.body.classList.contains('dark-theme')) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    filler_type: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    full_name: '',
    middle_name: '',
    last_name: '',
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
    } else if (roleParam === 'student') {
      setFormData(prev => ({ ...prev, filler_type: 'student' }));
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

  // Validate Step 0
  const validateStep0 = () => {
    const errors = {};
    if (!formData.filler_type) {
      errors.filler_type = 'Please select who is filling out this form';
    }

    if (formData.filler_type === 'guardian') {
      if (!formData.guardian.first_name) errors['guardian.first_name'] = 'Name is required';
      if (!formData.guardian.email) errors['guardian.email'] = 'Email is required';
      if (!formData.guardian.mobile_number) errors['guardian.mobile_number'] = 'Mobile number is required';
      else if (!/^[6-9]\d{9}$/.test(formData.guardian.mobile_number)) errors['guardian.mobile_number'] = 'Must be exactly 10 digits and start with 6, 7, 8, or 9';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return { isValid: false, errors };
    }

    setValidationErrors({});
    return { isValid: true };
  };

  // Validate Step 1
  const validateStep1 = () => {
    const result = validateForm(step1Schema, formData);
    if (!result.success) {
      setValidationErrors(result.errors);
      return { isValid: false, errors: result.errors };
    }
    setValidationErrors({});
    return { isValid: true };
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
    let errors = {};

    if (currentStep === 0) {
      const step0Validation = validateStep0();
      if (!step0Validation.isValid) return;
    }

    if (currentStep === 1) {
      const step1Validation = validateStep1();
      if (!step1Validation.isValid) return;
    }

    if (currentStep === 2) {
      if (!formData.interested_course_id) errors["interested_course_id"] = "Required";
      if (!formData.admission_year) errors["admission_year"] = "Required";
      if (!formData.learningMode) errors["learningMode"] = "Required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (currentStep === 3) {
      if (!validateStep2Dynamic()) return;
    }

    setValidationErrors({});
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
      // Create a clean payload with only necessary fields
      const payload = {
        ...formData
      };

      // Remove parent/guardian fields if they are empty so they don't trigger optional Zod validations
      if (payload.father && !payload.father.first_name) delete payload.father;
      if (payload.mother && !payload.mother.first_name) delete payload.mother;
      if (payload.guardian && !payload.guardian.first_name) delete payload.guardian;

      // Remove other empty objects if needed
      if (payload.permanent_address && !payload.permanent_address.house_no) delete payload.permanent_address;
      if (payload.current_address && !payload.current_address.house_no) delete payload.current_address;
      if (payload.previous_qualification && !payload.previous_qualification.school_college_name) delete payload.previous_qualification;

      // Validate everything one last time
      const finalValidation = validateForm(createLeadSchema, payload);
      if (!finalValidation.success) {
        setValidationErrors(finalValidation.errors);
        const errorFields = Object.keys(finalValidation.errors).map(key => {
          return key.split('.').pop().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        });
        setError(`Please fix the following missing/invalid fields: ${errorFields.join(', ')}`);
        setSubmitting(false);
        return;
      }

      const res = await API.post('/leads', payload);
      if (res.data.success) {
        setCurrentStep(6); // Show success step
      }
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
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            {currentStep === 6
              ? 'Your inquiry is complete. Thank you for choosing Droneco.'
              : 'Please complete this form to register details. One of our advisors will contact you shortly.'}
          </p>
        </div>

        {/* Subtle Step Tracker */}
        {currentStep >= 0 && currentStep <= 5 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step <strong style={{ color: 'var(--text-main)' }}>{currentStep + 1}</strong> of 6
            </div>
            <div style={{ display: 'flex', gap: '6px', width: '220px' }}>
              {[0, 1, 2, 3, 4, 5].map(step => (
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
        <div style={{ maxWidth: '750px', width: '100%' }}>
          {error && (
            <div style={{ background: 'var(--danger-glow)', border: '1px solid rgba(190, 18, 60, 0.15)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {currentStep === 0 && (
            <Step0
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              handleNestedChange={handleNestedChange}
              nextStep={nextStep}
            />
          )}

          {currentStep === 1 && (
            <Step1
              formData={formData}
              validationErrors={validationErrors}
              handleBasicChange={handleBasicChange}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <StepCourse
              formData={formData}
              handleBasicChange={handleBasicChange}
              validationErrors={validationErrors}
              courses={courses}
              prevStep={prevStep}
              nextStep={nextStep}
              formConfig={formConfig}
            />
          )}

          {currentStep === 3 && (
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

          {currentStep === 4 && (
            <Step3
              formData={formData}
              handleFeedbackChange={handleFeedbackChange}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 5 && (
            <Review
              formData={formData}
              courses={courses}
              questions={questions}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

          {currentStep === 6 && (
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
