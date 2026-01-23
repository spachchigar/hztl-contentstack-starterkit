'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, UseFormHandleSubmit } from 'react-hook-form';
import { CSLPFieldMapping, IFields } from '@/.generated';
import { Input } from './Input';
import { CheckBox } from './CheckBox';
import { cn } from '@/utils/cn';
// import { RichText } from '@/components/primitives/RichText';
import { ReCaptcha } from './ReCaptcha';
import { useReCaptcha } from '@/lib/hooks/useReCaptcha';
import { getCSLPAttributes } from '@/utils/type-guards';

type FieldClassNames = {
  input?: { wrapper?: string; element: string; label?: string };
  locations?: { wrapper?: string; element: string; label?: string };
  checkbox?: { wrapper?: string; element: string; label?: string; itemLabel?: string };
  disclaimer?: { wrapper?: string; element: string };
  submit?: { wrapper?: string; element: string };
};

interface FormFieldRendererProps {
  fields: IFields[];
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldErrors>;
  fieldClassNames?: FieldClassNames;
  enable_recaptcha?: boolean;
  onFormSubmit: UseFormHandleSubmit<FieldValues>;
  customOnSubmit?: (data: FieldValues) => Promise<void> | void;
  isSubmitting?: boolean;
  $?: {
    input?: CSLPFieldMapping;
    text_area?: CSLPFieldMapping;
    dropdown?: CSLPFieldMapping;
    radio_checkbox?: CSLPFieldMapping;
    locations?: CSLPFieldMapping;
    submit?: CSLPFieldMapping;
    disclaimer?: CSLPFieldMapping;
  };
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  fields,
  register,
  errors,
  fieldClassNames = {},
  enable_recaptcha,
  onFormSubmit,
  customOnSubmit,
  isSubmitting,
}) => {
  const {
    recaptchaRef,
    siteKey,
    recaptchaError,
    handleRecaptchaChange,
    validateRecaptchaForSubmission,
    getRecaptchaValue,
  } = useReCaptcha();

  const defaultFieldClasses: FieldClassNames = {
    input: { element: 'px-4 py-2 bg-white' },
    locations: { element: 'px-4 py-2 bg-white' },
    checkbox: {
      element:
        'w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
    },
    disclaimer: { element: 'text-sm text-white' },
    submit: { wrapper: 'flex flex-col gap-2', element: 'py-2 px-4 bg-white cursor-pointer' },
  };

  const handleSubmit = async (e: React.FormEvent, data: FieldValues) => {
    e.preventDefault();

    // Then, validate reCAPTCHA if enabled
    const isRecaptchaValid = validateRecaptchaForSubmission(enable_recaptcha);

    if (!isRecaptchaValid) {
      return; // Stop submission if reCAPTCHA validation fails
    }

    // Get reCAPTCHA token and include it in the data
    if (enable_recaptcha) {
      const recaptchaToken = getRecaptchaValue();
      data._recaptchaToken = recaptchaToken;
    }
    // If all validations pass, call the parent's form submit handler
    if (customOnSubmit) {
      customOnSubmit(data);
    }
  };
  return (
    <>
      {fields?.map((field, index) => {
        if (field.input) {
          // Destructure value to use as defaultValue in register, preventing conflicts with react-hook-form
          const { value, ...inputProps } = field.input;

          return (
            <Input
              key={index}
              labelClassName={fieldClassNames.input?.label}
              placeholder={field.input.placeholder_text}
              className={cn(defaultFieldClasses.input?.element, fieldClassNames.input?.element)}
              wrapperClassName={fieldClassNames.input?.wrapper}
              error={errors[field.input.name]?.message as string}
              id={field.input.name}
              {...register(field.input.name)}
              {...inputProps}
              defaultValue={value}
            />
          );
        }

        if (field.radio_checkbox) {
          return (
            <CheckBox
              key={index}
              label={field.radio_checkbox.label}
              options_group={field.radio_checkbox.options_group}
              error={errors[field.radio_checkbox.name]?.message as string}
              className={cn(
                defaultFieldClasses.checkbox?.element,
                fieldClassNames.checkbox?.element
              )}
              labelClassName={fieldClassNames.checkbox?.label}
              itemLabelClassName={fieldClassNames.checkbox?.itemLabel}
              wrapperClassName={fieldClassNames.checkbox?.wrapper}
              id={field.radio_checkbox.name}
              {...register(field.radio_checkbox.name, {
                ...(field.radio_checkbox.required ? { required: 'This field is required' } : {}),
                // For checkbox groups, ensure we collect as array
                ...(field.radio_checkbox.type === 'Checkbox'
                  ? {
                      validate: (value) => {
                        if (field.radio_checkbox.required) {
                          const arrayValue = Array.isArray(value) ? value : value ? [value] : [];
                          return arrayValue.length > 0 || 'Please select at least one option';
                        }
                        return true;
                      },
                    }
                  : {}),
              })}
              {...field.radio_checkbox}
              type={field.radio_checkbox.type || 'Checkbox'}
            />
          );
        }

        // if (field.disclaimer) {
        //   return (
        //     <RichText
        //       key={index}
        //       parentClassName={cn(
        //         defaultFieldClasses.disclaimer?.wrapper,
        //         fieldClassNames.disclaimer?.wrapper
        //       )}
        //       className={cn(
        //         defaultFieldClasses.disclaimer?.element,
        //         fieldClassNames.disclaimer?.element
        //       )}
        //       content={field.disclaimer.disclaimer_content}
        //       $={field.disclaimer.$?.disclaimer_content}
        //     />
        //   );
        // }

        if (field.submit) {
          return (
            <div
              key={index}
              className={cn(defaultFieldClasses.submit?.wrapper, fieldClassNames.submit?.wrapper)}
            >
              {enable_recaptcha && siteKey && (
                <ReCaptcha
                  ref={recaptchaRef}
                  siteKey={siteKey}
                  onChange={handleRecaptchaChange}
                  onError={() => {
                    handleRecaptchaChange(null);
                  }}
                  onExpired={() => {
                    handleRecaptchaChange(null);
                  }}
                  error={recaptchaError}
                />
              )}
              <button
                type="button"
                disabled={isSubmitting}
                className={cn(
                  defaultFieldClasses.submit?.element,
                  fieldClassNames.submit?.element,
                  isSubmitting && 'opacity-50 pointer-events-none'
                )}
                onClick={(e) => onFormSubmit((data) => handleSubmit(e, data))()}
                {...getCSLPAttributes(field.submit.$?.redirect_link)}
              >
                {field.submit.redirect_link?.title}
              </button>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};
