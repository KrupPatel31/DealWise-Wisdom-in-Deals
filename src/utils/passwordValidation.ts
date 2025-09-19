export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];

  // Minimum length: 8 characters
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Must include at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
  }

  // Must include at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
  }

  // Must include at least one digit
  if (!/\d/.test(password)) {
    errors.push('Password must include at least one digit');
  }

  // Must include at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must include at least one special character (!@#$%^&* etc.)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  const validation = validatePassword(password);
  const score = 5 - validation.errors.length;

  if (score <= 1) return { strength: score, label: 'Very Weak', color: 'text-red-500' };
  if (score === 2) return { strength: score, label: 'Weak', color: 'text-orange-500' };
  if (score === 3) return { strength: score, label: 'Fair', color: 'text-yellow-500' };
  if (score === 4) return { strength: score, label: 'Good', color: 'text-blue-500' };
  return { strength: score, label: 'Strong', color: 'text-green-500' };
};