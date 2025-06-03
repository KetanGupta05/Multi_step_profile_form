// Password strength checker
// Returns 0-3 (0 = Weak, 1 = Fair, 2 = Good, 3 = Strong)
export const checkPasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  // Length check
  if (password.length >= 8) score++;
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  // Number check
  if (/\d/.test(password)) score++;
  // Uppercase check
  if (/[A-Z]/.test(password)) score++;

  return Math.min(score, 3);
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username) {
    errors.push('Username is required');
  } else {
    if (username.length < 4 || username.length > 20) {
      errors.push('Must be 4-20 characters');
    }
    if (/\s/.test(username)) {
      errors.push('Cannot contain spaces');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Only letters, numbers and underscores allowed');
    }
  }
  
  return errors;
};

// Email validation
export const validateEmail = (email) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// Profile photo validation
export const validateProfilePhoto = (file) => {
  const errors = [];
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (!file) {
    errors.push('Profile photo is required');
  } else {
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPG/PNG images allowed');
    }
    if (file.size > maxSize) {
      errors.push('File must be less than 2MB');
    }
  }
  
  return errors;
};

// Date of birth validation
export const validateDOB = (dob) => {
  const errors = [];
  const today = new Date();
  const birthDate = new Date(dob);
  
  if (!dob) {
    errors.push('Date of birth is required');
  } else if (birthDate > today) {
    errors.push('Cannot be a future date');
  } else if (today.getFullYear() - birthDate.getFullYear() < 13) {
    errors.push('Must be at least 13 years old');
  }
  
  return errors;
};

// Form field sanitization
export const sanitizeInput = (input) => {
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Export all validations as an object
export default {
  checkPasswordStrength,
  validateUsername,
  validateEmail,
  validateProfilePhoto,
  validateDOB,
  sanitizeInput
};