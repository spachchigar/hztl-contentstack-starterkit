/**
 * Form Validation Constants and Error Messages
 * Reusable validation rules and error messages for form elements
 */

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: {
    INVALID: 'Enter a valid email address.',
  },
  PHONE: {
    INVALID: 'Please enter a valid phone number',
  },
  PASSWORD: {
    TOO_SHORT: 'Password must be at least 8 characters long',
    TOO_WEAK: 'Password must contain uppercase, lowercase, and number',
    MISMATCH: 'Passwords do not match',
  },
  LENGTH: {
    TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
    TOO_LONG: (max: number) => `Must be no more than ${max} characters`,
  },
  NUMBER: {
    INVALID: 'Please enter a valid number',
    TOO_SMALL: (min: number) => `Must be at least ${min}`,
    TOO_LARGE: (max: number) => `Must be no more than ${max}`,
  },
  DROPDOWN: {
    INVALID: 'Please select an option',
  },
} as const;

// ============================
// VALIDATION PATTERNS
// ============================

export const VALIDATION_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[\d\s\-().]+$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  ALPHABETIC: /^[A-Za-z\s]+$/,
  NUMERIC: /^\d+$/,
} as const;

// ============================
// VALIDATION RULES
// ============================

// export const VALIDATION_RULES = {
//   EMAIL: {
//     required: REQUIRED_MESSAGES.EMAIL,
//     pattern: {
//       value: VALIDATION_PATTERNS.EMAIL,
//       message: VALIDATION_MESSAGES.EMAIL.INVALID,
//     },
//   },
//   PHONE: {
//     required: REQUIRED_MESSAGES.PHONE,
//     pattern: {
//       value: VALIDATION_PATTERNS.PHONE,
//       message: VALIDATION_MESSAGES.PHONE.INVALID,
//     },
//   },
//   PASSWORD: {
//     required: REQUIRED_MESSAGES.PASSWORD,
//     minLength: {
//       value: 8,
//       message: VALIDATION_MESSAGES.PASSWORD.TOO_SHORT,
//     },
//     pattern: {
//       value: VALIDATION_PATTERNS.PASSWORD_STRONG,
//       message: VALIDATION_MESSAGES.PASSWORD.TOO_WEAK,
//     },
//   },
//   FIRST_NAME: {
//     required: REQUIRED_MESSAGES.FIRST_NAME,
//     minLength: {
//       value: 2,
//       message: VALIDATION_MESSAGES.LENGTH.TOO_SHORT(2),
//     },
//     maxLength: {
//       value: 50,
//       message: VALIDATION_MESSAGES.LENGTH.TOO_LONG(50),
//     },
//     pattern: {
//       value: VALIDATION_PATTERNS.ALPHABETIC,
//       message: 'Name can only contain letters and spaces',
//     },
//   },
//   LAST_NAME: {
//     required: REQUIRED_MESSAGES.LAST_NAME,
//     minLength: {
//       value: 2,
//       message: VALIDATION_MESSAGES.LENGTH.TOO_SHORT(2),
//     },
//     maxLength: {
//       value: 50,
//       message: VALIDATION_MESSAGES.LENGTH.TOO_LONG(50),
//     },
//     pattern: {
//       value: VALIDATION_PATTERNS.ALPHABETIC,
//       message: 'Name can only contain letters and spaces',
//     },
//   },
// } as const;

// ============================
// HELPER MESSAGES
// ============================

export const HELPER_MESSAGES = {
  EMAIL: "We'll never share your email with anyone else",
  PASSWORD: 'At least 8 characters with uppercase, lowercase, and number',
  PHONE: 'Include country code if outside the US',
  OPTIONAL: 'This field is optional',
  REQUIRED: 'This field is required',
} as const;
