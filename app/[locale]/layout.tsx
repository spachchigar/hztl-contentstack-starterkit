// app/[locale]/layout.tsx
import { fetchGlobalLabels } from '@/utils/fetch-global-labels';
import { Providers } from '@/providers';
import { isLanguageSupported } from '@/lib/contentstack/language';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ Locale from URL structure
};

export default async function LocaleLayout({ children, params }: Props) {
  // ✅ Fetch global labels with the correct locale
  const { locale } = await params;
  const globalLabels = await fetchGlobalLabels(isLanguageSupported(locale) ? locale : '');

  return <Providers data={{ globalLabels: globalLabels ?? {} }}>{children}</Providers>;
}
