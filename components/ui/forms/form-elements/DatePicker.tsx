'use client';
import React, { forwardRef, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '@/app/calendar.css';
import { cn } from '@/utils/cn';

export interface DatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  /**
   * The label text for the date picker (optional, for accessibility)
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
   * Custom className for styling the input
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
   * Date format for display (default: 'F j, Y' - e.g., "January 1, 2025")
   */
  dateFormat?: string;

  /**
   * Alternative date format for the actual input value (default: 'Y-m-d')
   */
  altFormat?: string;

  /**
   * Minimum selectable date
   */
  minDate?: string | Date;

  /**
   * Maximum selectable date
   */
  maxDate?: string | Date;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null, dateString: string) => void;
}

/**
 * DatePicker component using flatpickr
 * Supports all standard HTML input attributes and flatpickr configurations
 *
 * @see https://flatpickr.js.org/
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      labelClassName,
      id,
      dateFormat = 'm-d-Y',
      altFormat = 'm-d-y',
      minDate,
      maxDate,
      onChange,
      placeholder = 'Select Date',
      value,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

    // Use provided ID or a simple fallback
    const inputId = id || 'datepicker';

    useEffect(() => {
      if (!inputRef.current) return;

      // Initialize flatpickr
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: altFormat,
        altInput: true,
        altFormat: dateFormat,
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates, dateStr) => {
          if (onChange) {
            onChange(selectedDates[0] || null, dateStr);
          }
        },
        // Custom styling for the calendar
        prevArrow:
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path></svg>',
        nextArrow:
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path></svg>',
        // Hide year input
        onReady: (selectedDates, dateStr, instance) => {
          // Hide the year input after calendar is ready
          const yearInput = instance.yearElements?.[0] as HTMLInputElement | undefined;
          if (yearInput) {
            yearInput.style.display = 'none';
          }
        },
      });

      // Cleanup on unmount
      return () => {
        if (flatpickrInstance.current) {
          flatpickrInstance.current.destroy();
        }
      };
    }, [dateFormat, altFormat, minDate, maxDate, onChange]);

    // Sync external value changes with flatpickr
    useEffect(() => {
      if (flatpickrInstance.current && value && typeof value === 'string') {
        flatpickrInstance.current.setDate(value, false); // false = don't trigger onChange
      }
    }, [value]);

    return (
      <div className={cn(wrapperClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={cn(labelClassName)}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Date Input */}
        <input
          ref={(element) => {
            inputRef.current = element;
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          type="text"
          id={inputId}
          value={value || ''} // Ensure controlled input - default to empty string
          readOnly // flatpickr handles all interactions
          className={cn(
            'w-full py-[15px] px-[16px] border border-light rounded-[6px] text-white font-medium bg-transparent placeholder:text-[#9CA3AF] outline-none focus:border-white cursor-pointer',
            className
          )}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-left text-red-500 mt-1 text-sm">
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-left text-gray-400 mt-1 text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
