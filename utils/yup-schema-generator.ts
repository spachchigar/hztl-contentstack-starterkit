import * as yup from 'yup';
import { IFields } from '@/.generated';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '@/constants/form';

/**
 * Configuration options for schema generation
 */
export interface SchemaGeneratorConfig {
  /**
   * Whether to include validation messages
   */
  includeMessages?: boolean;

  /**
   * Custom validation messages to override defaults
   */
  customMessages?: {
    required?: string;
    email?: string;
    phone?: string;
    minLength?: (min: number) => string;
    maxLength?: (max: number) => string;
  };

  /**
   * Default validation behavior
   */
  defaults?: {
    /**
     * Make all fields required by default
     */
    allRequired?: boolean;

    /**
     * Default string validation options
     */
    stringOptions?: {
      trim?: boolean;
      lowercase?: boolean;
      uppercase?: boolean;
    };
  };
}

/**
 * Field validation configuration
 */
export interface FieldValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  customValidation?: (value: any) => boolean | string;
}

/**
 * Yup Schema Generator Service
 *
 * Generates Yup validation schemas from IFields configuration
 * Supports various field types and validation rules
 */
export class YupSchemaGenerator {
  private config: SchemaGeneratorConfig;

  constructor(config: SchemaGeneratorConfig = {}) {
    this.config = {
      includeMessages: true,
      customMessages: {},
      defaults: {
        allRequired: false,
        stringOptions: {
          trim: true,
        },
      },
      ...config,
    };
  }

  /**
   * Generate Yup schema from IFields array
   */
  generateSchema(fields: IFields[]): yup.ObjectSchema<any> {
    const shape = fields.reduce((acc, field) => {
      // Handle input fields
      if (field.input) {
        acc[field.input.name] = this.createInputValidation(field.input);
      }

      // Handle textarea fields
      if (field.text_area) {
        acc[field.text_area.name] = this.createTextAreaValidation(field.text_area);
      }

      // Handle dropdown fields
      if (field.dropdown) {
        acc[field.dropdown.name] = this.createDropdownValidation(field.dropdown);
      }

      // Handle radio/checkbox fields
      if (field.radio_checkbox) {
        acc[field.radio_checkbox.name] = this.createRadioCheckboxValidation(field.radio_checkbox);
      }

      return acc;
    }, {} as yup.ObjectShape);

    return yup.object().shape(shape);
  }

  /**
   * Create validation for input fields
   */
  private createInputValidation(input: IFields['input']): yup.StringSchema {
    let schema = yup.string();

    // Apply default string options
    if (this.config.defaults?.stringOptions?.trim) {
      schema = schema.trim();
    }
    if (this.config.defaults?.stringOptions?.lowercase) {
      schema = schema.lowercase();
    }
    if (this.config.defaults?.stringOptions?.uppercase) {
      schema = schema.uppercase();
    }

    // Handle required validation
    if (input.required || this.config.defaults?.allRequired) {
      const message = this.config.customMessages?.required || VALIDATION_MESSAGES.REQUIRED;
      schema = schema.required(message);
    }

    // Handle input type specific validation
    if (input.input_type === 'email') {
      const message = this.config.customMessages?.email || VALIDATION_MESSAGES.EMAIL.INVALID;
      schema = schema.email(message);
    }

    if (input.input_type === 'tel') {
      const message = this.config.customMessages?.phone || VALIDATION_MESSAGES.PHONE.INVALID;
      schema = schema
        .matches(VALIDATION_PATTERNS.PHONE, {
          message,
          excludeEmptyString: true, // Don't validate empty strings
        })
        .test('phone-digits', message, (value) => {
          if (!value) return true; // Let required validation handle empty values
          // Strip all non-digit characters to count actual digits
          const digitsOnly = value.replace(/\D/g, '');
          // Valid phone numbers should have between 7 and 15 digits (E.164 standard)
          return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        });
    }

    if (input.input_type === 'password') {
      schema = schema.min(8, VALIDATION_MESSAGES.PASSWORD.TOO_SHORT);
      if (this.config.includeMessages) {
        schema = schema.matches(
          VALIDATION_PATTERNS.PASSWORD_STRONG,
          VALIDATION_MESSAGES.PASSWORD.TOO_WEAK
        );
      }
    }

    // Handle custom validation from field configuration
    if (input.validation) {
      try {
        const validationConfig = JSON.parse(input.validation) as FieldValidationConfig;
        schema = this.applyCustomValidation(schema, validationConfig);
      } catch (error) {
        console.warn('Invalid validation configuration:', input.validation);
      }
    }

    return schema;
  }

  /**
   * Create validation for textarea fields
   */
  private createTextAreaValidation(textArea: IFields['text_area']): yup.StringSchema {
    let schema = yup.string();

    if (this.config.defaults?.stringOptions?.trim) {
      schema = schema.trim();
    }

    if (textArea.required || this.config.defaults?.allRequired) {
      const message = this.config.customMessages?.required || VALIDATION_MESSAGES.REQUIRED;
      schema = schema.required(message);
    }

    if (textArea.max_length) {
      const message =
        this.config.customMessages?.maxLength?.(textArea.max_length) ||
        VALIDATION_MESSAGES.LENGTH.TOO_LONG(textArea.max_length);
      schema = schema.max(textArea.max_length, message);
    }

    return schema;
  }

  /**
   * Create validation for dropdown fields
   */
  private createDropdownValidation(dropdown: IFields['dropdown']): yup.StringSchema {
    let schema = yup.string();

    if (dropdown.required || this.config.defaults?.allRequired) {
      const message = this.config.customMessages?.required || VALIDATION_MESSAGES.DROPDOWN.INVALID;
      schema = schema.required(message);
    }

    // Validate against available options if provided
    if (dropdown.required && dropdown.options_group && dropdown.options_group.length > 0) {
      const validValues = dropdown.options_group.map((option) => option.value);
      schema = schema.oneOf(validValues, 'Please select a valid option');
    }

    return schema;
  }

  /**
   * Create validation for radio/checkbox fields
   */
  private createRadioCheckboxValidation(radioCheckbox: IFields['radio_checkbox']): yup.Schema {
    if (radioCheckbox.type === 'Checkbox') {
      // For checkboxes, handle both single value and array
      let schema = yup
        .mixed()
        .test('checkbox-validation', 'Please select at least one option', function (value) {
          if (!radioCheckbox.required && !this.parent.defaults?.allRequired) {
            return true; // Not required, so pass
          }

          // Check if value exists (single checkbox or array)
          if (Array.isArray(value)) {
            return value.length > 0;
          }

          // Single checkbox value (boolean or string)
          return value !== undefined && value !== null && value !== false && value !== '';
        });

      return schema;
    } else {
      // For radio buttons, we expect a string
      let schema = yup.string();

      if (radioCheckbox.required || this.config.defaults?.allRequired) {
        const message = this.config.customMessages?.required || VALIDATION_MESSAGES.REQUIRED;
        schema = schema.required(message);
      }

      // Validate against available options if provided
      //   if (radioCheckbox.options_group && radioCheckbox.options_group.length > 0) {
      //     const validValues = radioCheckbox.options_group.map((option) => option.value);
      //     schema = schema.oneOf(validValues, 'Please select a valid option');
      //   }

      return schema;
    }
  }

  /**
   * Create validation for locations field (custom field type)
   */
  private createLocationsValidation(locations: any): yup.StringSchema {
    let schema = yup.string();

    if (locations.required || this.config.defaults?.allRequired) {
      const message = this.config.customMessages?.required || VALIDATION_MESSAGES.DROPDOWN.INVALID;
      schema = schema.required(message);
    }

    return schema;
  }

  /**
   * Apply custom validation configuration to a schema
   */
  private applyCustomValidation(
    schema: yup.StringSchema,
    config: FieldValidationConfig
  ): yup.StringSchema {
    if (config.required) {
      const message = this.config.customMessages?.required || VALIDATION_MESSAGES.REQUIRED;
      schema = schema.required(message);
    }

    if (config.minLength) {
      const message =
        this.config.customMessages?.minLength?.(config.minLength) ||
        VALIDATION_MESSAGES.LENGTH.TOO_SHORT(config.minLength);
      schema = schema.min(config.minLength, message);
    }

    if (config.maxLength) {
      const message =
        this.config.customMessages?.maxLength?.(config.maxLength) ||
        VALIDATION_MESSAGES.LENGTH.TOO_LONG(config.maxLength);
      schema = schema.max(config.maxLength, message);
    }

    if (config.pattern) {
      schema = schema.matches(config.pattern, 'Invalid format');
    }

    if (config.email) {
      const message = this.config.customMessages?.email || VALIDATION_MESSAGES.EMAIL.INVALID;
      schema = schema.email(message);
    }

    if (config.phone) {
      const message = this.config.customMessages?.phone || VALIDATION_MESSAGES.PHONE.INVALID;
      schema = schema
        .matches(VALIDATION_PATTERNS.PHONE, {
          message,
          excludeEmptyString: true, // Don't validate empty strings
        })
        .test('phone-digits', message, (value) => {
          if (!value) return true; // Let required validation handle empty values
          // Strip all non-digit characters to count actual digits
          const digitsOnly = value.replace(/\D/g, '');
          // Valid phone numbers should have between 7 and 15 digits (E.164 standard)
          return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        });
    }
    if (config.customValidation) {
      schema = schema.test('custom', 'Custom validation failed', (value) => {
        const result = config.customValidation!(value);
        return typeof result === 'string' ? false : result;
      });
    }

    return schema;
  }

  /**
   * Generate schema for a single field
   */
  generateFieldSchema(field: IFields): yup.Schema | null {
    if (field.input) {
      return this.createInputValidation(field.input);
    }

    if (field.text_area) {
      return this.createTextAreaValidation(field.text_area);
    }

    if (field.dropdown) {
      return this.createDropdownValidation(field.dropdown);
    }

    if (field.radio_checkbox) {
      return this.createRadioCheckboxValidation(field.radio_checkbox);
    }

    return null;
  }

  /**
   * Create a new generator with different configuration
   */
  withConfig(config: Partial<SchemaGeneratorConfig>): YupSchemaGenerator {
    return new YupSchemaGenerator({
      ...this.config,
      ...config,
    });
  }
}

/**
 * Default schema generator instance
 */
export const defaultYupGenerator = new YupSchemaGenerator();

/**
 * Utility function for quick schema generation
 */
export const generateYupSchema = (
  fields: IFields[],
  config?: SchemaGeneratorConfig
): yup.ObjectSchema<any> => {
  const generator = config ? new YupSchemaGenerator(config) : defaultYupGenerator;
  return generator.generateSchema(fields);
};

/**
 * Pre-configured generators for common use cases
 */
export const schemaGenerators = {
  /**
   * Strict generator - all fields required, includes all validation messages
   */
  strict: new YupSchemaGenerator({
    includeMessages: true,
    defaults: {
      allRequired: true,
      stringOptions: {
        trim: true,
      },
    },
  }),

  /**
   * Lenient generator - only explicitly required fields, minimal messages
   */
  lenient: new YupSchemaGenerator({
    includeMessages: false,
    defaults: {
      allRequired: false,
      stringOptions: {
        trim: true,
      },
    },
  }),

  /**
   * Custom messages generator - allows easy message customization
   */
  withCustomMessages: (messages: SchemaGeneratorConfig['customMessages']) =>
    new YupSchemaGenerator({
      includeMessages: true,
      customMessages: messages,
    }),
};

export default YupSchemaGenerator;
