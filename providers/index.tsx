'use client';
import { IDictionaryItems, ITheme } from '@/.generated';
import { GlobalLabelsProvider } from './GlobalLabelsProvider';
import { Brands } from '@/helpers/Constants/Constant';
import { BrandAndThemeProvider } from './BrandAndThemeContext';
// Initialize component registry early to avoid circular dependencies
import '@/utils/init-component-registry';

export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: {
    globalLabels: IDictionaryItems | object;
    brand?: Brands;
    theme?: NonNullable<ITheme['theme_options']>;
  };
}) {
  return (
    <BrandAndThemeProvider brand={data.brand} theme={data.theme}>
      <GlobalLabelsProvider value={data}>{children}</GlobalLabelsProvider>
    </BrandAndThemeProvider>
  );
}
