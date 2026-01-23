import { CSLPAttribute, CSLPFieldMapping } from '@/.generated';

// Helper function to safely handle CSLPFieldMapping for JSX attributes
export const getCSLPAttributes = (cslpField?: CSLPFieldMapping): CSLPAttribute => {
  if (!cslpField) return {};
  if (typeof cslpField === 'object') return cslpField;
  return {};
};
