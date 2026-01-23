'use client';

// Global
import { Brands } from '@/helpers/Constants/Constant';
import { createContext, useContext } from 'react';
import { supportedFonts } from '@/lib/fonts';
import { ITheme } from '@/.generated';
import { BRAND_MAPPING } from '@/utils/brand-helpers';

export const ALL_BRANDS = Object.keys(BRAND_MAPPING) as Brands[];

export const THEME_MAPPING: Record<NonNullable<ITheme['theme_options']>, string[]> = {
  ThemesWhite: ['ThemesWhite'],
  ThemesLight: ['ThemesLight'],
  ThemesDark: ['ThemesDark'],
  ThemesBrandPrimary: ['ThemesBrandPrimary'],
  ThemesBrandSecondary: ['ThemesBrandSecondary'],
};

export const ALL_THEMES = Object.keys(THEME_MAPPING) as NonNullable<ITheme['theme_options']>[];

export interface BrandAndTheme {
  brand: Brands;
  theme: NonNullable<ITheme['theme_options']>;
}

export const BrandAndThemeContext = createContext<BrandAndTheme>({
  brand: ALL_BRANDS[0],
  theme: ALL_THEMES[0],
});

export const useBrandAndTheme = () => {
  return useContext(BrandAndThemeContext);
};

type BrandAndThemeProviderProps = {
  children: React.ReactNode;
  /**
   * Optional. The brand to use. Will fallback to the parent brand or the first brand if not provided.
   */
  brand?: Brands;
  /**
   * Optional. The theme to use. Will fallback to the parent theme or the first theme if not provided .
   */
  theme?: NonNullable<ITheme['theme_options']>;
};

export const BrandAndThemeProvider = ({ children, brand, theme }: BrandAndThemeProviderProps) => {
  const parentBrandAndTheme = useContext(BrandAndThemeContext);
  const brandAndTheme = {
    brand: brand ?? parentBrandAndTheme.brand ?? ALL_BRANDS[0],
    theme: theme ?? parentBrandAndTheme.theme ?? ALL_THEMES[0],
  };

  return (
    <div
      className={`${brandAndTheme.brand} ${brandAndTheme.theme} ${supportedFonts.map((font) => font.variable).join(' ')} brand-root`}
    >
      <BrandAndThemeContext.Provider value={brandAndTheme}>
        {children}
      </BrandAndThemeContext.Provider>
    </div>
  );
};
