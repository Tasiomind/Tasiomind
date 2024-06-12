export const validateName = v => {
  if (!v) {
    return { isValid: false, message: 'NameIsRequired' };
  }
  if (v.length < 3) {
    return { isValid: false, message: 'Name must be at least 3 characters' };
  }
  return { isValid: true, message: '' };
};

export const validateUsername = v => {
  if (!v) {
    return { isValid: false, message: 'UsernameIsRequired' };
  }
  if (v.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }
  return { isValid: true, message: '' };
};

export const validateEmail = v => {
  if (!v) {
    return { isValid: false, message: 'EmailIsRequired' };
  }
  if (!/.+@.+\..+/.test(v)) {
    return { isValid: false, message: 'EmailIsInvalid' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = v => {
  const validations = [
    { isValid: !!v, message: 'Password is required' },
    {
      isValid: v && /^[A-Z]/.test(v),
      message: 'passwordFirstCapital',
    },
    {
      isValid: v && /[A-Z]/.test(v),
      message: 'Password must contain at least one uppercase letter',
    },
    { isValid: v && v.length >= 8, message: 'Password must be at least 8 characters' },
    {
      isValid: v && /[a-z]/.test(v),
      message: 'Password must contain at least one lowercase letter',
    },
    { isValid: v && /[0-9]/.test(v), message: 'Password must contain at least one number' },
    {
      isValid: v && /[@$!%*?&#]/.test(v),
      message: 'Password must contain at least one special character',
    },
  ];

  for (const validation of validations) {
    if (!validation.isValid) {
      return { isValid: false, message: validation.message };
    }
  }

  return { isValid: true, message: '' };
};
