import React, { useState, useEffect } from 'react';
import { checkPasswordStrength } from '../utils/validators';
import { checkUsername } from '../api';

const Step1 = ({ formData, updateFormData, nextStep }) => {
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(formData.profilePhotoPreview || '');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Initialize form data with all required fields
  useEffect(() => {
    updateFormData({
      ...formData,
      gender: formData.gender || '',
      dob: formData.dob || '',
      customGender: formData.customGender || ''
    });
  }, []);

  // Real-time username availability check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.username && formData.username.length >= 4 && !errors.username) {
        setIsCheckingUsername(true);
        try {
          const { available } = await checkUsername(formData.username);
          setUsernameAvailable(available);
          if (!available) {
            setErrors(prev => ({ ...prev, username: 'Username already taken' }));
          }
        } catch (error) {
          console.error('Username check failed:', error);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Password strength calculation
  useEffect(() => {
    if (formData.newPassword) {
      setPasswordStrength(checkPasswordStrength(formData.newPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [formData.newPassword]);

  const validate = () => {
    const newErrors = {};

    // Profile photo validation
    if (!formData.profilePhoto && !previewUrl) {
      newErrors.profilePhoto = 'Profile photo is required';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = 'Username must be 4-20 characters';
    } else if (/\s/.test(formData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username already taken';
    }

    // Current password required if new password entered
    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required to change password';
    }

    // New password rules
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Must contain at least one special character';
      }
      if (!/\d/.test(formData.newPassword)) {
        newErrors.newPassword = 'Must contain at least one number';
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else if (formData.gender === 'other' && !formData.customGender) {
      newErrors.customGender = 'Please specify your gender';
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Must be JPG or PNG' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePhoto: 'File must be ≤2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result;
        setPreviewUrl(preview);
        updateFormData({ 
          profilePhoto: file,
          profilePhotoPreview: preview 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure all required fields are included before validation
    const completeFormData = {
      ...formData,
      gender: formData.gender || '',
      dob: formData.dob || '',
      customGender: formData.customGender || ''
    };
    
    updateFormData(completeFormData);

    if (validate()) {
      // Ensure Step2 will receive all required fields
      updateFormData({
        ...completeFormData,
        profession: formData.profession || 'Student', // Default value
        companyName: formData.companyName || '',
        address1: formData.address1 || ''
      });
      nextStep();
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ff4444', '#ffbb33', '#00C851', '#007E33'];
    return colors[passwordStrength];
  };

  return (
    <form onSubmit={handleSubmit} className="step-form">
      {/* Profile Photo */}
      <div className="form-group">
        <label>Profile Photo (JPG/PNG, ≤2MB)</label>
        <input 
          type="file" 
          name="profilePhoto" 
          accept=".jpg,.jpeg,.png" 
          onChange={handlePhotoChange} 
        />
        {errors.profilePhoto && <div className="error">{errors.profilePhoto}</div>}
        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="Profile Preview" className="preview-image" />
          </div>
        )}
      </div>

      {/* Username */}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleInputChange}
        />
        <div className="feedback-container">
          {isCheckingUsername && <span className="checking">Checking...</span>}
          {usernameAvailable === true && <span className="available">✓ Available</span>}
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
      </div>

      {/* Gender */}
      <div className="form-group">
        <label>Gender</label>
        <select 
          name="gender" 
          value={formData.gender || ''}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {formData.gender === 'other' && (
          <input
            name="customGender"
            placeholder="Specify your gender"
            value={formData.customGender || ''}
            onChange={handleInputChange}
          />
        )}
        {errors.gender && <div className="error">{errors.gender}</div>}
        {errors.customGender && <div className="error">{errors.customGender}</div>}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth</label>
        <input 
          type="date" 
          name="dob"
          max={new Date().toISOString().split('T')[0]}
          value={formData.dob || ''}
          onChange={handleInputChange}
        />
        {errors.dob && <div className="error">{errors.dob}</div>}
      </div>

      {/* Current Password */}
      <div className="form-group">
        <label>Current Password (if changing password)</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword || ''}
          onChange={handleInputChange}
        />
        {errors.currentPassword && <div className="error">{errors.currentPassword}</div>}
      </div>

      {/* New Password */}
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword || ''}
          onChange={handleInputChange}
        />
        {formData.newPassword && (
          <div className="password-strength">
            <div 
              className="strength-bar" 
              style={{ 
                width: `${(passwordStrength + 1) * 25}%`,
                backgroundColor: getPasswordStrengthColor()
              }}
            ></div>
            <span className="strength-text">
              {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
            </span>
          </div>
        )}
        {errors.newPassword && <div className="error">{errors.newPassword}</div>}
      </div>

      <button type="submit" className="submit-btn">Next</button>
    </form>
  );
};

export default Step1;