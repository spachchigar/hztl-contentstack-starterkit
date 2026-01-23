import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { IFields } from '@/.generated';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface SelectProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<IFields['dropdown'], 'name' | 'required'> {
  /**
   * The label text for the select (optional, for accessibility)
   */
  label?: string;

  /**
   * Error message to display below the select
   */
  error?: string;

  /**
   * Helper text to display below the select
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

  /**
   * Array of options for the select
   */
  options?: SelectOption[];

  /**
   * Placeholder text (creates an empty option at the top)
   */
  placeholder?: string;

  /**
   * Whether to allow empty selection (adds empty option)
   */
  allowEmpty?: boolean;

  /**
   * Text for empty option when allowEmpty is true
   */
  emptyText?: string;
}

/**
 * Select component based on MDN HTML select specification
 * Fully compatible with React Hook Form using forwardRef
 *
 * Supports all standard HTML select attributes including:
 * - value, defaultValue
 * - required
 * - disabled
 * - multiple
 * - autoFocus
 * - form
 *
 * @example
 * // Basic usage with React Hook Form
 * <Select
 *   {...register('country', { required: 'Please select a country' })}
 *   label="Country"
 *   options={countryOptions}
 *   error={errors.country?.message}
 * />
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      labelClassName,
      options = [],
      placeholder,
      allowEmpty = false,
      id,
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      $,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const selectId = id || '';

    return (
      <div className={cn(wrapperClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className={cn(labelClassName)}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select */}
        <select
          ref={ref}
          id={selectId}
          aria-label={label ? label : 'Select'}
          className={className}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...(props.value === undefined && {
            defaultValue: options.find((option) => option.selected)?.value ?? '',
          })}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled={!allowEmpty}>
              {placeholder}
            </option>
          )}

          {/* Options from props */}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}

          {/* Custom children options */}
          {children}
        </select>

        {/* Error message */}
        {error && (
          <p id={`${selectId}-error`} role="alert" className="text-left text-red-soft">
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && <p id={`${selectId}-helper`}>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
