// Shared locale constants used across the application
export const SUPPORTED_LOCALES = ['en-us', 'en', 'es'] as const;
export const DEFAULT_LOCALE = 'en-us' as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Language display names
export const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  'en-us': 'EN',
  en: 'EN',
  es: 'ES',
};

// Map language variants to base language codes
// This groups variants like 'en-us' and 'en' as the same language
export const LANGUAGE_VARIANT_MAP: Record<SupportedLocale, string> = {
  'en-us': 'en',
  en: 'en',
  es: 'es',
};

// Preferred locale for each language (used when switching languages)
export const PREFERRED_LOCALE_BY_LANGUAGE: Record<string, SupportedLocale> = {
  en: 'en-us', // Prefer 'en-us' over 'en' for English
  es: 'es',
};

// Languages that should NOT appear in the URL (English is the default, no prefix needed)
export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGES_WITHOUT_URL_PREFIX = [DEFAULT_LANGUAGE];
