import React, { useState, useEffect } from 'react';
import { getCountries, getStates, getCities } from '../api';

const subscriptionPlans = ["Basic", "Pro", "Enterprise"];

export default function Step3({ formData, updateFormData, nextStep, prevStep, errors, setErrors }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load countries on mount
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      getStates(formData.country).then(data => {
        setStates(data);
        updateFormData({ state: '', city: '' });
      });
    } else {
      setStates([]);
      updateFormData({ state: '', city: '' });
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.state) {
      getCities(formData.state).then(data => {
        setCities(data);
        updateFormData({ city: '' });
      });
    } else {
      setCities([]);
      updateFormData({ city: '' });
    }
  }, [formData.state]);

  const validate = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.subscription) newErrors.subscription = 'Subscription plan is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    updateFormData({ [name]: val });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="step-form">
      <h2>Preferences</h2>

      <div className="form-group">
        <label>Country*</label>
        <select
          name="country"
          value={formData.country || ''}
          onChange={handleChange}
          className={errors.country ? 'error-input' : ''}
        >
          <option value="">Select Country</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <div className="error">{errors.country}</div>}
      </div>

      <div className="form-group">
        <label>State*</label>
        <select
          name="state"
          value={formData.state || ''}
          onChange={handleChange}
          className={errors.state ? 'error-input' : ''}
          disabled={!states.length}
        >
          <option value="">Select State</option>
          {states.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.state && <div className="error">{errors.state}</div>}
      </div>

      <div className="form-group">
        <label>City*</label>
        <select
          name="city"
          value={formData.city || ''}
          onChange={handleChange}
          className={errors.city ? 'error-input' : ''}
          disabled={!cities.length}
        >
          <option value="">Select City</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.city && <div className="error">{errors.city}</div>}
      </div>

      <div className="form-group">
        <label>Subscription Plan*</label>
        <div className="option-group">
          {subscriptionPlans.map(plan => (
            <div key={plan} className="option-item">
              <input
                type="radio"
                id={`subscription-${plan.toLowerCase()}`}
                name="subscription"
                value={plan}
                checked={formData.subscription === plan}
                onChange={handleChange}
              />
              <label className="radio-label" htmlFor={`subscription-${plan.toLowerCase()}`}>
                {plan}
              </label>
            </div>
          ))}
        </div>
        {errors.subscription && <div className="error">{errors.subscription}</div>}
      </div>

      <div className="form-group">
        <div className="newsletter-container">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter ?? true}
            onChange={handleChange}
          />
          <label className="radio-label" htmlFor="newsletter">
            Subscribe to Newsletter
          </label>
        </div>
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