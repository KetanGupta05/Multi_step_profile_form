import React, { useState, useEffect } from 'react';

const professions = ["Student", "Developer", "Entrepreneur"];

export default function Step2({ formData, updateFormData, errors, setErrors, nextStep, prevStep }) {
  const [touched, setTouched] = useState({});

  // Validate all fields
  const validate = () => {
    const newErrors = {};

    // Profession validation
    if (!formData.profession) {
      newErrors.profession = 'Profession is required';
    }

    // Company Name validation (only for Entrepreneurs)
    if (formData.profession === "Entrepreneur" && !formData.companyName?.trim()) {
      newErrors.companyName = 'Company Name is required for Entrepreneurs';
    }

    // Address validation
    if (!formData.address1?.trim()) {
      newErrors.address1 = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset company name if profession changes from Entrepreneur
    if (name === 'profession' && value !== "Entrepreneur") {
      updateFormData({ companyName: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(); // Validate on blur
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="step-form">
      <h2>Professional Details</h2>

      <div className="form-group">
        <label>Profession*</label>
        <select
          name="profession"
          value={formData.profession || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.profession ? 'error-input' : ''}
        >
          <option value="" disabled>Select Profession</option>
          {professions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.profession && <div className="error">{errors.profession}</div>}
      </div>

      {formData.profession === "Entrepreneur" && (
        <div className="form-group">
          <label>Company Name*</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.companyName ? 'error-input' : ''}
            placeholder="Enter your company name"
          />
          {errors.companyName && <div className="error">{errors.companyName}</div>}
        </div>
      )}

      <div className="form-group">
        <label>Address Line 1*</label>
        <input
          type="text"
          name="address1"
          value={formData.address1 || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.address1 ? 'error-input' : ''}
          placeholder="Street address, P.O. box, company name"
        />
        {errors.address1 && <div className="error">{errors.address1}</div>}
      </div>

      <div className="form-navigation">
        <button type="button" onClick={prevStep} className="secondary-btn">
          Back
        </button>
        <button type="submit" className="primary-btn">
          Next
        </button>
      </div>
    </form>
  );
}