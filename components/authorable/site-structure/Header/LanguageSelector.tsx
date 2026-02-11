'use client';

// Global
import { useCallback, useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';
import { useParams, usePathname } from 'next/navigation';

// Local
import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { useHeader } from './HeaderContext';
import { useGlobalLabels } from '@/context/GlobalLabelContext';
import { LANGUAGE_DETAILS, type LanguageDetail } from '@/constants/locales';
import { isLanguageSupported } from '@/lib/contentstack/language';
import { LanguageService } from '@/lib/services/language-service';
import { setLanguagePreference } from '@/app/actions/language';

/**
 * LanguageSelector Component
 * Displays a dropdown for selecting languages/locales
 * Supports both mobile and desktop views
 */
const LanguageSelector = () => {
  // ============================================================================
  // Hooks & State
  // ============================================================================

  const params = useParams();
  const pathname = usePathname();
  const { globalLabels } = useGlobalLabels();

  const {
    isMobile,
    isMobileLanguageSelectorOpen,
    isDesktopLanguageSelectorOpen,
    setMobileLanguageSelectorOpen,
    setDesktopLanguageSelectorOpen,
    closeDesktopMenus,
    closeMobileMenu,
  } = useHeader();

  // Refs for click-outside detection
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const currentLocale = params.locale as string;

  // Parse pathname to get path without locale
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const pathWithoutLocale = pathSegments
    .slice(isLanguageSupported(firstSegment) ? 1 : 0)
    .join('/');

  // Get available languages and current selection
  const availableLanguages = LANGUAGE_DETAILS || [];

  const currentLanguage = availableLanguages.find((lang) => lang.langCode === currentLocale);

  // Determine mobile vs desktop state
  const isOpen = isMobile ? isMobileLanguageSelectorOpen : isDesktopLanguageSelectorOpen;
  const setIsOpen = isMobile ? setMobileLanguageSelectorOpen : setDesktopLanguageSelectorOpen;
  const closeAllMenus = isMobile ? closeMobileMenu : closeDesktopMenus;

  // Labels with fallbacks
  const ariaLabel = globalLabels.country_selector_aria_label || 'Select a language';
  const selectedLabel = globalLabels.is_selected_label || 'is selected';

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        selectRef.current &&
        dropdownRef.current &&
        !selectRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, closeAllMenus]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen, setIsOpen]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        closeAllMenus();
      }
    },
    [isOpen, setIsOpen, closeAllMenus]
  );

  /**
   * Get URL path for a language switch
   */
  const getLanguageHref = (langCode: string): string => {
    return LanguageService.getLanguageUrlPath(langCode, pathWithoutLocale);
  };

  const handleLanguageSelect = useCallback(async (langCode: string) => {
    // Save the language preference
    LanguageService.saveLanguagePreference(langCode);
    setIsOpen(false);
    closeAllMenus();

    // Set the language preference cookie server-side + redirect atomically
    await setLanguagePreference(langCode, getLanguageHref(langCode));
  }, [setIsOpen, closeAllMenus, getLanguageHref]);

  // ============================================================================
  // Render Helpers
  // ============================================================================


  /**
   * Generate aria label for language option
   */
  const getLanguageAriaLabel = (language: LanguageDetail & { langCode: string }, isSelected: boolean): string => {
    const baseLabel = `${language.nativeName} ${language.countryName || ''}`.trim();
    return isSelected ? `${baseLabel} ${selectedLabel}` : baseLabel;
  };

  // ============================================================================
  // Styles
  // ============================================================================

  const styles = TAILWIND_VARIANTS({ isOverlayVisible: isOpen });

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.base()} ref={selectRef}>
      {/* Selector Button */}
      <button
        type="button"
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${ariaLabel} - ${currentLanguage?.nativeName || ''} ${currentLanguage?.countryName || ''}`}
        className={styles.buttonClasses()}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.buttonContainer()}>
          <div className={styles.countryNameWrapper()}>
            <span className="sr-only">{ariaLabel}</span>
            <span className={styles.countryText()}>
              {currentLanguage?.nativeName || currentLocale}
            </span>
            {currentLanguage?.countryName && (
              <span className={styles.languageText()}>
                {currentLanguage.countryName}
              </span>
            )}
          </div>

          <span className={styles.chevronContainer()}>
            <SvgIcon
              className={styles.buttonIcon()}
              fill="currentColor"
              icon="chevron-up"
              size="xs"
              viewBox="0 0 24 24"
            />
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={styles.dropDownMenuWrapper()}
          role="menu"
          aria-label={ariaLabel}
        >
          <ul className={styles.dropDownMenuList()}>
            {availableLanguages.map((language) => {
              const isSelected = currentLanguage?.langCode === language.langCode;

              return (
                <li key={language.langCode} role="none">
                  <button
                    role="menuitem"
                    aria-current={isSelected ? 'page' : undefined}
                    aria-label={getLanguageAriaLabel(language, isSelected)}
                    onClick={() => { handleLanguageSelect(language.langCode) }}
                    className={styles.dropDownMenuItem()}
                  >
                    <span className={styles.dropDownItemName()}>
                      <span className={styles.countryText()}>
                        {language.nativeName}
                      </span>
                      {language.countryName && (
                        <span className={styles.languageText()}>
                          {language.countryName}
                        </span>
                      )}
                    </span>

                    {isSelected && (
                      <span className="sr-only">{selectedLabel}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

// ============================================================================
// Styles
// ============================================================================

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'relative',
      'z-50',
    ],
    buttonClasses: [
      'flex',
      'items-center',
      'gap-3',
      'px-4',
      'py-2.5',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'hover:bg-gray-50',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-1',
      'border',
      'border-gray-200',
      'bg-white',
      'shadow-sm',
      'hover:shadow-md',
      'hover:border-gray-300',
    ],
    buttonContainer: [
      'flex',
      'items-center',
      'gap-3',
      'min-w-0',
    ],
    countryNameWrapper: [
      'flex',
      'flex-col',
      'min-w-0',
      'flex-1',
    ],
    countryText: [
      'text-sm',
      'font-semibold',
      'text-gray-900',
      'leading-tight',
      'truncate',
    ],
    languageText: [
      'text-xs',
      'font-normal',
      'text-gray-600',
      'leading-tight',
      'truncate',
    ],
    dropDownMenuWrapper: [
      'absolute',
      'top-full',
      'left-0',
      'right-0',
      'md:right-auto',
      'md:min-w-[200px]',
      'mt-2',
      'bg-white',
      'rounded-lg',
      'shadow-lg',
      'border',
      'border-gray-200',
      'overflow-hidden',
      'transition-all',
      'duration-200',
      'origin-top',
    ],
    dropDownMenuList: [
      'py-1',
      'max-h-[300px]',
      'overflow-y-auto',
    ],
    dropDownMenuItem: [
      'flex',
      'items-center',
      'justify-between',
      'gap-3',
      'px-4',
      'py-2.5',
      'text-sm',
      'text-gray-700',
      'transition-colors',
      'duration-150',
      'cursor-pointer',
      'hover:bg-gray-50',
      'focus:bg-gray-50',
      'focus:outline-none',
      'border-l-2',
      'border-transparent',
      'hover:border-blue-500',
      'hover:text-gray-900',
      'w-full',
      'text-left',
    ],
    dropDownItemName: [
      'flex',
      'flex-col',
      'min-w-0',
      'flex-1',
    ],
    chevronContainer: [
      'flex',
      'items-center',
      'justify-center',
      'ml-auto',
    ],
    buttonIcon: [
      'h-4',
      'w-4',
      'text-gray-500',
      'transition-transform',
      'duration-200',
    ],
  },
  variants: {
    isOverlayVisible: {
      true: {
        dropDownMenuWrapper: [
          'scale-100',
          'opacity-100',
          'visible',
          'pointer-events-auto',
        ],
        buttonIcon: [
          'rotate-180',
          'text-blue-600',
        ],
        buttonClasses: [
          'ring-2',
          'ring-blue-500',
          'ring-offset-1',
          'border-blue-500',
        ],
      },
      false: {
        dropDownMenuWrapper: [
          'scale-95',
          'opacity-0',
          'invisible',
          'pointer-events-none',
        ],
        buttonIcon: [
          'rotate-0',
        ],
      },
    },
  },
});