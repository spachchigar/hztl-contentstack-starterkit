import { createHash } from 'crypto';

export const toPascalCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before camelCase transitions
    .replace(/[_\-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')) // Uppercase after delimiters
    .replace(/^[a-z]/, (c) => c.toUpperCase()); // Capitalize first letter
};

export const hashSHA256 = (input: string): string => {
  return createHash('sha256').update(input, 'utf8').digest('hex');
};

export const generateGUID = (): string => {
  return crypto.randomUUID();
};
