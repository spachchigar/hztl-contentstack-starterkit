'use client';
import { useRef, useCallback, useState } from 'react';
import type { ReCaptchaRef } from '@/components/ui/forms/form-elements/ReCaptcha';

interface UseReCaptchaReturn {
  /**
   * Reference to the reCAPTCHA component
   */
  recaptchaRef: React.RefObject<ReCaptchaRef | null>;

  /**
   * Whether reCAPTCHA is enabled (has site key)
   */
  isEnabled: boolean;

  /**
   * Site key for reCAPTCHA
   */
  siteKey: string | null;

  /**
   * Current reCAPTCHA token
   */
  recaptchaToken: string | null;

  /**
   * Current reCAPTCHA error message
   */
  recaptchaError: string;

  /**
   * Handler for reCAPTCHA token changes
   */
  handleRecaptchaChange: (token: string | null) => void;

  /**
   * Execute reCAPTCHA verification (for invisible reCAPTCHA)
   */
  executeRecaptcha: () => void;

  /**
   * Reset reCAPTCHA
   */
  resetRecaptcha: () => void;

  /**
   * Get current reCAPTCHA token value
   */
  getRecaptchaValue: () => string | null;

  /**
   * Validate reCAPTCHA before form submission
   * Returns true if valid or reCAPTCHA is disabled, false otherwise
   */
  validateRecaptchaForSubmission: (isRecaptchaEnabled?: boolean) => boolean;
}

/**
 * Custom hook for reCAPTCHA functionality
 * Provides easy access to reCAPTCHA operations and client-side validation
 */
export const useReCaptcha = (): UseReCaptchaReturn => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY || null;
  const isEnabled = Boolean(siteKey);
  const recaptchaRef = useRef<ReCaptchaRef | null>(null);

  // State management
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string>('');

  const executeRecaptcha = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    }
  }, []);

  const resetRecaptcha = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setRecaptchaToken(null);
    setRecaptchaError('');
  }, []);

  const getRecaptchaValue = useCallback(() => {
    if (recaptchaRef.current) {
      return recaptchaRef.current.getValue();
    }
    return null;
  }, []);

  // Handle reCAPTCHA token changes
  const handleRecaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setRecaptchaError('');
    }
  }, []);

  // Simple client-side validation function for form submission
  const validateRecaptchaForSubmission = useCallback(
    (isRecaptchaEnabled?: boolean) => {
      // If reCAPTCHA is not enabled, validation passes
      if (!isRecaptchaEnabled) {
        return true;
      }

      // Get the current token
      const currentToken = getRecaptchaValue();

      if (!currentToken) {
        setRecaptchaError('Please complete the reCAPTCHA verification');
        return false;
      }

      // Client-side validation passed
      return true;
    },
    [getRecaptchaValue]
  );

  return {
    recaptchaRef,
    isEnabled,
    siteKey,
    recaptchaToken,
    recaptchaError,
    handleRecaptchaChange,
    executeRecaptcha,
    resetRecaptcha,
    getRecaptchaValue,
    validateRecaptchaForSubmission,
  };
};
