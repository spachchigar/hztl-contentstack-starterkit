import React, { forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { IFields } from '@/.generated';

export interface CheckBoxOption {
  item_id: string;
  value: string;
  label?: string;
  checked: boolean;
}

export interface CheckBoxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /**
   * The label text for the checkbox group (from CMS)
   */
  label?: string;

  /**
   * The field name for form registration
   */
  name?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * The type of field (Radio or Checkbox)
   */
  type?: 'Radio' | 'Checkbox';

  /**
   * Array of checkbox/radio options from CMS
   */
  options?: CheckBoxOption[];

  options_group?: CheckBoxOption | CheckBoxOption[];

  /**
   * Error message to display below the checkbox
   */
  error?: string;

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;

  /**
   * Custom className for the wrapper div
   */
  wrapperClassName?: string;

  /**
   * Custom className for the group label (main label)
   */
  labelClassName?: string;

  /**
   * Custom className for individual item labels
   */
  itemLabelClassName?: string;

  /**
   * Custom className for checkbox/radio input elements
   */
  className?: string;

  /**
   * Layout direction for checkboxes
   */
  direction?: 'horizontal' | 'vertical';

  singleMode?: boolean;
  singleLabel?: string;
}

/**
 * CheckBox component supporting both single checkbox and checkbox/radio group modes
 * Compatible with React Hook Form and CMS data structures
 */
export const CheckBox = forwardRef<
  HTMLInputElement,
  CheckBoxProps & Partial<IFields['radio_checkbox']>
>(
  (
    {
      label,
      error,
      helperText,
      wrapperClassName,
      labelClassName,
      itemLabelClassName,
      className,
      options = [],
      options_group,
      direction = 'vertical',
      singleMode = false,
      singleLabel,
      type = 'Checkbox',
      id,
      name,
      required,
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      $,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || name || '';
    const groupId = `${checkboxId}-group`;

    const processedOptions: CheckBoxOption[] = options_group
      ? Array.isArray(options_group)
        ? options_group
        : [options_group]
      : options;

    const shouldUseSingleMode =
      singleMode || (processedOptions.length === 1 && type === 'Checkbox');
    const inputType = type === 'Radio' ? 'radio' : 'checkbox';

    if (shouldUseSingleMode) {
      const singleOption = processedOptions[0];
      const displayLabel = singleLabel || singleOption?.label || singleOption?.value || label;

      return (
        <div className={cn('flex flex-col gap-1', wrapperClassName)}>
          <div className="flex items-center gap-2">
            <input
              ref={ref}
              type={inputType}
              id={checkboxId}
              name={name}
              value={singleOption?.value || 'true'}
              defaultChecked={singleOption?.checked}
              className={className}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
              }
              required={required}
              {...props}
            />
            {displayLabel && (
              <label htmlFor={checkboxId} className={cn('', itemLabelClassName)}>
                {displayLabel}
              </label>
            )}
          </div>

          {error && (
            <p id={`${checkboxId}-error`} role="alert" className="text-left text-red-soft text-sm">
              {error}
            </p>
          )}

          {helperText && !error && (
            <p id={`${checkboxId}-helper`} className="text-sm text-gray-600">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    const [selectedValues, setSelectedValues] = useState<string[]>(() => {
      if (type === 'Checkbox') {
        return processedOptions.filter((option) => option.checked).map((option) => option.value);
      }
      return [];
    });

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (type === 'Checkbox') {
        setSelectedValues((prev) => {
          const newValues = checked
            ? [...prev, optionValue]
            : prev.filter((value) => value !== optionValue);

          if (onChange) {
            const syntheticEvent = {
              target: { name: name || '', value: newValues },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }

          return newValues;
        });
      }
    };

    return (
      <div
        className={cn('flex flex-col gap-2', wrapperClassName)}
        role={inputType === 'radio' ? 'radiogroup' : 'group'}
        aria-labelledby={groupId}
      >
        {type === 'Checkbox' && (
          <input type="hidden" name={name} value={JSON.stringify(selectedValues)} {...props} />
        )}

        {label && (
          <label id={groupId} className={cn('text-[24px] text-[#757575] mb-2', labelClassName)}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={cn('flex gap-', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
          }
        >
          {processedOptions.map((option, index) => {
            const optionId = `${checkboxId}-${option.item_id || index}`;
            const isChecked =
              type === 'Checkbox' ? selectedValues.includes(option.value) : option.checked;

            return (
              <div key={option.item_id || index} className="flex items-center gap-3">
                <input
                  type={inputType}
                  id={optionId}
                  name={type === 'Radio' ? name : undefined}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => {
                    if (type === 'Checkbox') {
                      handleCheckboxChange(option.value, e.target.checked);
                    }
                  }}
                  className={className}
                  required={required}
                  {...(type === 'Radio' ? props : {})}
                />
                {(option.label || option.value) && (
                  <label htmlFor={optionId} className={cn('', itemLabelClassName)}>
                    {option.label || option.value}
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p id={`${checkboxId}-error`} role="alert" className="text-left text-red-soft text-sm">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${checkboxId}-helper`} className="text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CheckBox.displayName = 'CheckBox';
