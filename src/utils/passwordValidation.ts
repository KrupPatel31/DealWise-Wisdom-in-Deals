export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  criteria: PasswordCriteria[];
}

export interface PasswordCriteria {
  label: string;
  met: boolean;
  icon: 'check' | 'x';
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  const criteria: PasswordCriteria[] = [];

  // Minimum length: 8 characters
  const hasMinLength = password.length >= 8;
  criteria.push({
    label: 'At least 8 characters',
    met: hasMinLength,
    icon: hasMinLength ? 'check' : 'x'
  });
  if (!hasMinLength) {
    errors.push('Password must be at least 8 characters long');
  }

  // Must include at least one lowercase letter
  const hasLowercase = /[a-z]/.test(password);
  criteria.push({
    label: 'One lowercase letter (a-z)',
    met: hasLowercase,
    icon: hasLowercase ? 'check' : 'x'
  });
  if (!hasLowercase) {
    errors.push('Password must include at least one lowercase letter');
  }

  // Must include at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  criteria.push({
    label: 'One uppercase letter (A-Z)',
    met: hasUppercase,
    icon: hasUppercase ? 'check' : 'x'
  });
  if (!hasUppercase) {
    errors.push('Password must include at least one uppercase letter');
  }

  // Must include at least one digit
  const hasDigit = /\d/.test(password);
  criteria.push({
    label: 'One number (0-9)',
    met: hasDigit,
    icon: hasDigit ? 'check' : 'x'
  });
  if (!hasDigit) {
    errors.push('Password must include at least one digit');
  }

  // Must include at least one special character
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  criteria.push({
    label: 'One special character (!@#$%^&*)',
    met: hasSpecialChar,
    icon: hasSpecialChar ? 'check' : 'x'
  });
  if (!hasSpecialChar) {
    errors.push('Password must include at least one special character (!@#$%^&* etc.)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    criteria
  };
};

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  const validation = validatePassword(password);
  const score = validation.criteria.filter(c => c.met).length;

  if (score <= 1) return { strength: score, label: 'Very Weak', color: 'text-red-500' };
  if (score === 2) return { strength: score, label: 'Weak', color: 'text-orange-500' };
  if (score === 3) return { strength: score, label: 'Fair', color: 'text-yellow-500' };
  if (score === 4) return { strength: score, label: 'Good', color: 'text-blue-500' };
  return { strength: score, label: 'Strong', color: 'text-green-500' };
};