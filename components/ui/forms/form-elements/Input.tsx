import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { IFields } from '@/.generated';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The type of input. Defaults to 'text' as per MDN documentation
   */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';

  /**
   * The label text for the input (optional, for accessibility)
   */
  label?: string;

  /**
   * Error message to display below the input
   */
  error?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: string;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Custom className for the wrapper div
   */
  wrapperClassName?: string;

  /**
   * Custom className for the label
   */
  labelClassName?: string;
}

/**
 * Input component based on MDN HTML input[type="text"] specification
 * Supports all standard HTML input attributes including:
 * - value, defaultValue
 * - placeholder
 * - required
 * - disabled, readOnly
 * - minLength, maxLength
 * - pattern (regex validation)
 * - autoComplete, autoFocus
 * - list (for datalist integration)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/text
 */
export const Input = forwardRef<HTMLInputElement, InputProps & Partial<IFields['input']>>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      labelClassName,
      id,
      maxLength,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      $,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || '';

    return (
      <div className={cn(wrapperClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={cn(labelClassName)}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          id={inputId}
          maxLength={maxLength}
          className={className}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-left text-red-soft">
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && <p id={`${inputId}-helper`}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
