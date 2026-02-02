import React from 'react';
import { notFound } from 'next/navigation';
import { IPage } from '@/.generated';
import { Header } from '@/components/authorable/site-structure/Header/Header';
import { Footer } from '@/components/authorable/Footer';
import { tv } from 'tailwind-variants';
import BackToTop from '@/components/authorable/site-structure/BackToTop/BackToTop';
import { fetchPageData } from '@/lib/contentstack/page-data';
import { MainLayout } from '@/components/authorable/site-structure/MainLayout/MainLayout';

interface SharedPageLayoutProps {
  urlPath: string;
  children?: React.ReactNode;
  pageContentTypeUID?: string;
}

/**
 * Shared page layout component that handles common page rendering logic.
 * Fetches page data and header, then renders the page with header and tracking script.
 *
 * @component
 * @param {SharedPageLayoutProps} props - The component props containing the URL path
 * @returns {JSX.Element} The rendered component.
 */
export async function SharedPageLayout({
  urlPath,
  pageContentTypeUID = 'page',
}: SharedPageLayoutProps) {
  // Fetch page data using shared function
  let page: IPage | undefined;
  let header, footer;


  try {
    const pageData = await fetchPageData(urlPath, pageContentTypeUID);
    page = pageData.page;
    header = pageData.header;
    footer = pageData.footer;
  } catch (error) {
    console.error('Error fetching page in contentstack:', error);
    notFound();
  }
  // If no page found, fetch 404 page from CMS
  if (!page) {
    const pageData = await fetchPageData('/404', 'page');
    page = pageData.page;
    pageContentTypeUID = 'page';
  }

  // If no 404 page found from CMS, show default 404 page
  if (!page || page === undefined) {
    notFound();
  }

  const {
    footer: footerClass,
    footerContentContainer: footerContentContainerClass,
    main: mainClass,
  } = TAILWIND_VARIANTS();
  return (
    <>
      <div className="prod-mode">
        <div className={mainClass()} tabIndex={-1}>
          {header && <Header {...header} />}
          <main>
            <div id="content">
              <MainLayout page={page} pageContentTypeUID={pageContentTypeUID} />
            </div>
          </main>
          <footer className={footerClass()}>
            <div className={footerContentContainerClass()}>{footer && <Footer />}</div>
          </footer>
          <BackToTop />
        </div>
      </div>
    </>
  );
}

const TAILWIND_VARIANTS = tv({
  slots: {
    footer: ['bg-color-surface-surface'],
    footerContentContainer: ['w-full'],
    main: ['font-typography-body-font-family', 'overflow-x-clip'],
  },
});
