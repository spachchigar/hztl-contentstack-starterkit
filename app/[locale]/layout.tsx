// app/[locale]/layout.tsx
import { fetchGlobalLabels } from '@/utils/fetch-global-labels';
import { Providers } from '@/providers';
import { isLanguageSupported } from '@/lib/contentstack/language';
import { getBrandForSiteName } from '@/utils/brand-helpers';
import { SiteName } from '@/helpers/Constants/Constant';
// Initialize component registry early to avoid circular dependencies
import '@/utils/init-component-registry';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ Locale from URL structure
};

export default async function LocaleLayout({ children, params }: Props) {
  // ✅ Fetch global labels with the correct locale
  const { locale } = await params;
  const globalLabels = await fetchGlobalLabels(isLanguageSupported(locale) ? locale : '');
  const brand = getBrandForSiteName(process.env.NEXT_PUBLIC_SITE_NAME as SiteName);

  return <Providers data={{ globalLabels: globalLabels ?? {}, brand }}>{children}</Providers>;
}
