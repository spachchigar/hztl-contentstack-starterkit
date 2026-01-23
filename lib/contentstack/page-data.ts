import { getPage, getHeader, getFooter } from '@/lib/contentstack/entries';
import { IHeader as HeaderProps, IFooter as FooterProps, IPage } from '@/.generated';

// Type mapping for page content types
type PageTypeMap = {
  page: IPage;
};

export interface PageData {
  page: IPage | undefined;
  header: HeaderProps | undefined;
  footer: FooterProps | undefined;
}

/**
 * Shared function to fetch page data that can be used by both
 * generateMetadata and SharedPageLayout components
 *
 * Optimized: All API calls are made in parallel for faster response
 */
export async function fetchPageData(
  urlPath: string,
  pageContentTypeUID: string = 'page'
): Promise<PageData> {
  // Use the type mapping to get the correct type, fallback to IPage for unknown types
  const pageType = pageContentTypeUID as keyof PageTypeMap;

  // Fetch all data in parallel for maximum performance
  const [page, header, footer] = await Promise.all([
    getPage<PageTypeMap[typeof pageType]>(urlPath, pageContentTypeUID),
    getHeader(),
    getFooter(),
  ]);

  return {
    page,
    header,
    footer,
  };
}
