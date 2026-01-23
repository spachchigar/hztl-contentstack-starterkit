import React from 'react';
import { Metadata } from 'next';
import { extractAndSetLanguage } from '@/lib/contentstack/language';
import { getPage } from '@/lib/contentstack/entries';
import { stack } from '@/lib/contentstack/stack';
import { SharedPageLayout } from '@/app/SharedPageLayout';
import { IPage } from '@/.generated';
import { headers } from 'next/headers';

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

  // Extract and set the language from locale parameter
  extractAndSetLanguage(resolvedParams?.locale);

  // Construct the same URL path as in the component
  const slugArray = resolvedParams.slug || [];
  const pathSegments = slugArray;
  const urlPath = `/${pathSegments?.join('/')}`;

  try {
    const page = await getPage<IPage>(urlPath, 'page');

    return {
      title: page?.seo?.meta_title || 'Page Title',
      description: page?.seo?.meta_description || undefined,
      alternates: {
        canonical: `${baseUrl}${urlPath}`,
        languages: {
          'en-us': `${baseUrl}/en-us${urlPath}`,
        },
      },
      openGraph: {
        type: page?.seo?.open_graph?.type || 'website',
        title: page?.seo?.meta_title || 'Page Title',
        description: page?.seo?.meta_description || undefined,
        url: `${baseUrl}${urlPath}`,
        images: [
          {
            url: page?.seo?.open_graph?.image?.file?.url || '',
            width: page?.seo?.open_graph?.image?.image_width || undefined,
            height: page?.seo?.open_graph?.image?.image_height || undefined,
          },
        ],
      },
      robots: {
        index:
          process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production'
            ? page?.seo?.robots?.enable_search_indexing || false
            : false,
        'max-image-preview': page?.seo?.robots?.max_image_preview || 'standard',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Title',
    };
  }
}
