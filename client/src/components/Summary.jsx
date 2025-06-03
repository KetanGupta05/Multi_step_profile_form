import React from 'react';

export default function Summary({ formData, onBack, onSubmit, submitting, submitError }) {
  // formData contains all collected fields, including file preview path

  return (
    <div>
      <h2>Summary</h2>
      <div>
        <strong>Profile Photo:</strong><br />
        {formData.profilePhotoPreview ? (
          <img src={formData.profilePhotoPreview} alt="Profile" style={{ maxWidth: '150px', borderRadius: '8px' }} />
        ) : 'No photo uploaded'}
      </div>
      <div><strong>Username:</strong> {formData.username}</div>
      <div><strong>Profession:</strong> {formData.profession}</div>
      {formData.profession === 'Entrepreneur' && (
        <div><strong>Company Name:</strong> {formData.companyName}</div>
      )}
      <div><strong>Address Line 1:</strong> {formData.address1}</div>
      <div><strong>Country:</strong> {formData.country}</div>
      <div><strong>State:</strong> {formData.state}</div>
      <div><strong>City:</strong> {formData.city}</div>
      <div><strong>Subscription Plan:</strong> {formData.subscription}</div>
      <div><strong>Newsletter Subscription:</strong> {formData.newsletter ? 'Yes' : 'No'}</div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={onBack} disabled={submitting}>Back</button>{' '}
        <button onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {submitError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{submitError}</div>}
    </div>
  );
}
