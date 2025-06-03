import React, { useState, useCallback } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Summary from './components/Summary';

export default function App() {
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    profilePhoto: null,
    profilePhotoPreview: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    profession: '',
    companyName: '',
    address1: '',
    country: '',
    state: '',
    city: '',
    subscription: '',
    newsletter: true,
  });

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateFormData = useCallback((newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 4)), []);
  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profilePhotoPreview') return;
        if (value !== null && value !== undefined && value !== '') {
          fd.append(key, value);
        }
      });

      const res = await fetch('http://localhost:5000/api/users/submit', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Submission failed');
      }

      alert('Profile submitted successfully!');
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during submission.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{
      maxWidth: 600,
      margin: '2rem auto',
      padding: '2rem',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      {step === 1 && (
        <Step1 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {step === 2 && (
        <Step2 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {step === 3 && (
        <Step3 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {step === 4 && (
        <Summary
          formData={formData}
          onBack={prevStep}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}
