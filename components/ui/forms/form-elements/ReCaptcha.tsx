'use client';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { cn } from '@/utils/cn';

export interface ReCaptchaProps {
  /**
   * Google reCAPTCHA site key
   */
  siteKey: string;

  /**
   * Callback function called when reCAPTCHA is verified
   */
  onChange?: (token: string | null) => void;

  /**
   * Callback function called when reCAPTCHA expires
   */
  onExpired?: () => void;

  /**
   * Callback function called when reCAPTCHA encounters an error
   */
  onError?: () => void;

  /**
   * Theme for the reCAPTCHA widget
   */
  theme?: 'light' | 'dark';

  /**
   * Size of the reCAPTCHA widget
   */
  size?: 'compact' | 'normal' | 'invisible';

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Error message to display below the reCAPTCHA
   */
  error?: string;

  /**
   * Tab index for accessibility
   */
  tabindex?: number;
}

export interface ReCaptchaRef {
  /**
   * Execute the reCAPTCHA (for invisible reCAPTCHA)
   */
  execute: () => void;

  /**
   * Reset the reCAPTCHA
   */
  reset: () => void;

  /**
   * Get the current reCAPTCHA response token
   */
  getValue: () => string | null;
}

/**
 * ReCaptcha component wrapper around react-google-recaptcha
 * Provides a consistent interface with error handling and accessibility
 */
export const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  (
    {
      siteKey,
      onChange,
      onExpired,
      onError,
      theme = 'light',
      size = 'normal',
      className,
      error,
      tabindex,
    },
    ref
  ) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      execute: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.execute();
        }
      },
      reset: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      },
      getValue: () => {
        if (recaptchaRef.current) {
          return recaptchaRef.current.getValue();
        }
        return null;
      },
    }));

    const handleChange = (token: string | null) => {
      onChange?.(token);
    };

    const handleExpired = () => {
      onExpired?.();
    };

    const handleError = () => {
      onError?.();
    };

    if (!siteKey) {
      console.warn('ReCaptcha: siteKey is required');
      return null;
    }

    return (
      <div className={cn(className)}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={handleChange}
          onExpired={handleExpired}
          onError={handleError}
          theme={theme}
          size={size}
          tabindex={tabindex}
        />

        {/* Error message */}
        {error && (
          <p role="alert" className="text-left text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';
