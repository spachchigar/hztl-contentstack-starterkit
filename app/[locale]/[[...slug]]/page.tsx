// Global
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

// Local
import { extractAndSetLanguage, isLanguageSupported } from '@/lib/contentstack/language';
import { getPage, getSiteSettings } from '@/lib/contentstack/entries';
import { stack } from '@/lib/contentstack/delivery-stack';
import { SharedPageLayout } from '@/app/SharedPageLayout';
import { IPage } from '@/.generated';
import { DEFAULT_LOCALE } from '@/constants/locales';
import { Locales } from '@contentstack/management/types/stack/contentType/entry';
import { getEntryLocales } from '@/lib/contentstack/management-stack';

// Force dynamic rendering (SSR)
export const dynamic = 'force-dynamic';

interface SlugPageProps {
  params: Promise<{
    slug: Array<string>;
    locale: string;
  }>;
  searchParams: Promise<{
    live_preview: string;
    entry_uid: string;
    content_type_uid: string;
  }>;
}

/**
 * The `SlugPage` component handles all dynamic routes using catch-all routing.
 * It constructs the URL path from the slug parameters and fetches the corresponding
 * content from Contentstack.
 *
 * @component
 * @param {SlugPageProps} props - The component props containing the slug parameters
 * @returns {JSX.Element} The rendered component.
 */
export default async function SlugPage(props: SlugPageProps) {
  //#region Live Preview Settings
  // Need to await for headers to be available for live preview
  await headers();
  const { params, searchParams } = props;

  const { live_preview, entry_uid, content_type_uid } = await searchParams;

  if (live_preview) {
    stack.livePreviewQuery({
      live_preview,
      contentTypeUid: content_type_uid || '',
      entryUid: entry_uid || '',
    });
  }
  //#endregion

  // Resolve params and construct URL path
  const resolvedParams = await params;

  // Extract and set the language from locale parameter
  extractAndSetLanguage(resolvedParams?.locale);

  const slugArray = resolvedParams.slug || [];
  const pathSegments = slugArray;

  const urlPath = `/${pathSegments?.join('/')}`; // Join slug array with '/' and add leading slash

  return <SharedPageLayout urlPath={urlPath} />;
}

export async function generateMetadata(props: SlugPageProps): Promise<Metadata> {
  const { params } = props;
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Construct the same URL path as in the component
  const slugArray = resolvedParams.slug || [];
  const pathSegments = slugArray;
  const urlPath = `/${pathSegments?.join('/')}`;

  if (!isLanguageSupported(resolvedParams?.locale)) {
    console.error('Language not supported:', resolvedParams?.locale);
    return {
      title: 'Page Title',
    }
  }

  try {
    const page = await getPage<IPage>(urlPath, 'page', resolvedParams?.locale);
    const siteSetting = await getSiteSettings();
    let languageUrls: Record<string, string> | undefined;
    let localesList: Locales | undefined;

    if (!page) {
      return {
        title: 'Page Title',
        description: 'Page Description',
      }
    }

    if (page) {
      localesList = await getEntryLocales(page.uid, 'page')
    }

    if (localesList && localesList.locales.length > 0) {
      languageUrls = localesList.locales.reduce((acc, locale) => {
        // Skip non-localized locales and default locale
        if (locale.code !== DEFAULT_LOCALE && !locale.localized) return acc;

        // Set default locale
        if (locale.code === DEFAULT_LOCALE) {
          acc[DEFAULT_LOCALE] = `${baseUrl}${urlPath}`;
          return acc;
        }

        acc[locale.code as string] = `${baseUrl}/${locale.code}${urlPath}`;
        return acc;
      }, {} as Record<string, string>);

    }

    const metadata = {
      pageTitle: page?.seo?.title || 'Page',
      MetaDescription: page?.seo?.description || undefined,
      MetaKeywords: page?.seo?.keywords || undefined,
      OpenGraphType: page?.seo?.opengraph?.type || 'website',
      OpenGraphTitle: page?.seo?.opengraph?.title || undefined,
      OpenGraphDescription: page?.seo?.opengraph?.description || undefined,
      OpenGraphImage: page?.seo?.opengraph?.image?.url || undefined,
      OpenGraphSiteName: page?.seo?.opengraph?.site_name || undefined,
      TwitterTitle: page?.seo?.twitter?.title || undefined,
      TwitterDescription: page?.seo?.twitter?.description || undefined,
      TwitterImage: page?.seo?.twitter?.image?.url || undefined,
      TwitterCardType: page?.seo?.twitter?.card_type || 'summary',
      TwitterSite: page?.seo?.twitter?.site || undefined,
      robotsIndex: page?.seo?.robots?.index || false,
      robotsFollow: page?.seo?.robots?.follow || false,
      robotsMaxImagePreview: page?.seo?.robots?.max_image_preview || 'standard',
    }

    const faviconUrl = siteSetting?.favicon_file?.url || '/favicon.ico';
    const cannonicalUrl = resolvedParams?.locale === DEFAULT_LOCALE ? `${baseUrl}${urlPath}` : `${baseUrl}/${resolvedParams?.locale}${urlPath}`;
    const shouldIndex = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production' ? metadata.robotsIndex : false;
    const shouldFollow = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production' ? metadata.robotsFollow : false;

    return {
      title: metadata.pageTitle,
      description: metadata.MetaDescription,
      keywords: metadata.MetaKeywords,
      alternates: {
        canonical: cannonicalUrl,
        languages: languageUrls,
      },
      icons: faviconUrl,
      openGraph: {
        type: metadata.OpenGraphType,
        title: metadata.OpenGraphTitle,
        description: metadata.OpenGraphDescription,
        url: cannonicalUrl,
        images: metadata.OpenGraphImage,
        siteName: metadata.OpenGraphSiteName,
      },
      twitter: {
        title: metadata.TwitterTitle,
        description: metadata.TwitterDescription,
        images: metadata.TwitterImage,
        card: metadata.TwitterCardType,
        site: metadata.TwitterSite,
      },
      robots: {
        index: shouldIndex,
        follow: shouldFollow,
        'max-image-preview': metadata.robotsMaxImagePreview,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Title',
    };
  }
}
