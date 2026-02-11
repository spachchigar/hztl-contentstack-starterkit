import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  SupportedLocale,
  LANGUAGES_WITHOUT_URL_PREFIX,
} from '../../constants/locales';

const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';
const LANGUAGE_PREFERENCE_STORAGE_KEY = 'language-preference';

/**
 * LanguageService class for managing language-related operations
 * Provides both instance methods for current language state and static utility methods
 */
class LanguageService {
  private static instance: LanguageService;
  private currentLanguage: string = DEFAULT_LOCALE;

  private constructor() { }

  public static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  // Instance methods for managing current language state

  public setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public isLanguageSupported(language: string): boolean {
    //Need to check if contentstack has the language code api
    //https://www.contentstack.com/docs/developers/multilingual-content/list-of-supported-languages
    // Check if the language or its base language variant is supported
    return (
      SUPPORTED_LOCALES.includes(language as any)
    );
  }

  /**
   * Save language preference to both cookie (for server-side) and localStorage (for client-side)
   * @param baseLanguage - The base language code (e.g., 'en', 'es')
   */
  public static saveLanguagePreference(baseLanguage: string): void {
    if (typeof window === 'undefined') return;

    // Save to localStorage for client-side access
    try {
      localStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, baseLanguage);
    } catch (error) {
      console.warn('Failed to save language preference to localStorage:', error);
    }

    // cookie for server-side is stored in the action for atomicity
  }

  /**
   * Get stored language preference from cookie (for server-side) or localStorage (for client-side)
   * @param cookieHeader - Optional cookie header string for server-side access
   * @returns The preferred locale or null if not found
   */
  public static getStoredLanguagePreference(cookieHeader?: string): SupportedLocale | null {
    // Server-side: read from cookie header
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      const stored = cookies[LANGUAGE_PREFERENCE_COOKIE];
      if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
      }
      return null;
    }

    // Client-side: read from localStorage
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
      if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
      }
    } catch (error) {
      console.warn('Failed to read language preference from localStorage:', error);
    }

    return null;
  }

  // Static utility methods

  /**
   * ! Function not needed as of now
   */
  /**
   * Get base language code from any locale variant
   * @param locale - The locale string (e.g., 'en-us', 'en', 'es')
   * @returns The base language code (e.g., 'en' from 'en-us' or 'en')
   */
  // public static getBaseLanguage(locale: string): string {
  //   if (!locale) return '';
  //   return LANGUAGE_VARIANT_MAP[locale as SupportedLocale] || locale.split('-')[0];
  // }

  /**
   * ! Function not needed as of now
   */
  /**
   * Get preferred locale for a base language
   * @param baseLanguage - The base language code (e.g., 'en', 'es')
   * @returns The preferred locale variant (e.g., 'en-us' for 'en')
   */
  // public static getPreferredLocale(baseLanguage: string): SupportedLocale {
  //   return PREFERRED_LOCALE_BY_LANGUAGE[baseLanguage] || (baseLanguage as SupportedLocale);
  // }

  /**
   * Check if a language should appear in the URL
   * @param baseLanguage - The base language code
   * @returns true if the language should have a URL prefix, false otherwise
   */
  public static shouldShowLanguageInUrl(baseLanguage: string): boolean {
    return !LANGUAGES_WITHOUT_URL_PREFIX.includes(baseLanguage);
  }

  /**
   * Get URL path for a language (with or without prefix based on language)
   * @param baseLanguage - The base language code
   * @param pathWithoutLocale - The path without the locale prefix
   * @returns The complete URL path with or without language prefix
   */
  public static getLanguageUrlPath(baseLanguage: string, pathWithoutLocale: string): string {
    const basePath = pathWithoutLocale ? `/${pathWithoutLocale}` : '/';

    if (LanguageService.shouldShowLanguageInUrl(baseLanguage)) {
      return `/${baseLanguage}${basePath}`;
    }

    // English (default) - no language prefix
    return basePath;
  }

  /**
   * ! Function not needed as of now
   */

  /**
   * Get unique languages (one per language, not per variant)
   * @returns Array of unique languages with their preferred locale and label
   */
  // public static getUniqueLanguages(): Array<{
  //   baseLanguage: string;
  //   preferredLocale: SupportedLocale;
  //   label: string;
  // }> {
  //   const languageMap = new Map<string, { preferredLocale: SupportedLocale; label: string }>();

  //   SUPPORTED_LOCALES.forEach((locale) => {
  //     const baseLanguage = LanguageService.getBaseLanguage(locale);
  //     if (!languageMap.has(baseLanguage)) {
  //       languageMap.set(baseLanguage, {
  //         preferredLocale: LanguageService.getPreferredLocale(baseLanguage),
  //         label: LANGUAGE_NAMES[locale],
  //       });
  //     }
  //   });

  //   return Array.from(languageMap.entries()).map(([baseLanguage, { preferredLocale, label }]) => ({
  //     baseLanguage,
  //     preferredLocale,
  //     label,
  //   }));
  // }
}

// Export class for singleton access via getInstance() and static method access
export { LanguageService };
