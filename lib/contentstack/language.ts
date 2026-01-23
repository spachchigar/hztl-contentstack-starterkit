// Importing the language service
import { LanguageService } from '../services/language-service';

/**
 * Helper function to get current language
 * @returns The current language code
 */
export function getCurrentLanguage(): string {
  return LanguageService.getInstance().getLanguage();
}

/**
 * Helper function to set current language
 * @param language - The language code to set
 */
export function setCurrentLanguage(language: string): void {
  LanguageService.getInstance().setLanguage(language);
}

/**
 * Extract locale from params and set it as the current language
 * This helper reduces duplication across page components and generateMetadata
 * @param locale - The locale string from route params
 * @returns The resolved language code (defaults to 'en-us' if locale is not supported)
 */
export function extractAndSetLanguage(locale: string): string {
  const isLanguageParam = isLanguageSupported(locale);
  const language = isLanguageParam ? locale : 'en-us';
  setCurrentLanguage(language);
  return language;
}

/**
 * Check if a language is supported
 * @param language - The language code to check
 * @returns true if the language is supported, false otherwise
 */
export function isLanguageSupported(language: string): boolean {
  return LanguageService.getInstance().isLanguageSupported(language);
}
