import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge classes with clsx and tailwind-merge
 * - clsx: handles conditional logic and arrays/objects
 * - twMerge: resolves TailwindCSS class conflicts intelligently
 *
 * @param inputs - Class values (strings, objects, arrays, conditionals)
 * @returns Merged and conflict-resolved class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
