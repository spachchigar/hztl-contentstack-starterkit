import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  /**
   * The label text for the textarea (optional, for accessibility)
   */
  label?: string;

  /**
   * Error message to display below the textarea
   */
  error?: string;

  /**
   * Helper text to display below the textarea
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
 * TextArea component based on MDN HTML textarea specification
 * Supports all standard HTML textarea attributes including:
 * - value, defaultValue
 * - placeholder
 * - required
 * - disabled, readOnly
 * - minLength, maxLength
 * - rows, cols
 * - wrap (soft, hard, off)
 * - autoComplete, autoFocus
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      labelClassName,
      id,
      maxLength,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const textareaId = id || '';

    return (
      <div className={cn(wrapperClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={textareaId} className={cn(labelClassName)}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* TextArea */}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          className={className}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p id={`${textareaId}-error`} role="alert" className="text-left text-red-soft">
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && <p id={`${textareaId}-helper`}>{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
