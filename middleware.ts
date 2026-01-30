// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/constants/locales';
import { LanguageService } from '@/lib/services/language-service';

const PUBLIC_FILE = /\.(.*)$/;
const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of paths to skip - explicit checks for safety
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const firstSegment = segments[1];

  // Get stored language preference from cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const storedPreference = LanguageService.getStoredLanguagePreference(cookieHeader);

  let response: NextResponse;
  let shouldUpdateCookie = false;
  let localeToUse: SupportedLocale = DEFAULT_LOCALE;

  // If first segment is a supported locale
  if (SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    localeToUse = firstSegment as SupportedLocale;

    // Redirect default locale with prefix to clean URL
    if (localeToUse === DEFAULT_LOCALE) {
      // Remove the /en-us/ prefix and redirect to clean URL
      const pathWithoutLocale = '/' + segments.slice(2).join('/');
      const url = request.nextUrl.clone();
      url.pathname = pathWithoutLocale || '/';
      shouldUpdateCookie = true;
      response = NextResponse.redirect(url, 301);
    } else {
      // Non-default locales: allow through
      shouldUpdateCookie = true;
      response = NextResponse.next();
    }
  } else {
    // For paths without locale prefix, check for stored preference
    if (storedPreference) {
      const shouldShowInUrl = LanguageService.shouldShowLanguageInUrl(storedPreference);

      if (shouldShowInUrl) {
        // Redirect to URL with locale prefix for non-English languages
        const url = request.nextUrl.clone();
        url.pathname = `/${storedPreference}${pathname}`;
        response = NextResponse.redirect(url);
      } else {
        // For English, rewrite internally but keep URL clean
        const url = request.nextUrl.clone();
        url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
        response = NextResponse.rewrite(url);
      }
      localeToUse = storedPreference;
      shouldUpdateCookie = true;
    } else {
      // No stored preference, use default (English)
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
      response = NextResponse.rewrite(url);
      localeToUse = DEFAULT_LOCALE;
    }
  }

  // Update cookie if needed
  if (shouldUpdateCookie) {
    response.cookies.set(LANGUAGE_PREFERENCE_COOKIE, localeToUse, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
    });
  }

  // Add cache-control headers for SSR pages
  response.headers.set(
    'Cache-Control',
    `public, max-age=${process.env.CACHE_MAX_AGE || 3600}, stale-while-revalidate=${process.env.STALE_WHILE_REVALIDATE || 86400}`
  );

  // Set the current locale as a response header for debugging/CDN rules
  response.headers.set('X-Locale', localeToUse);

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths and special files
    '/((?!_next/|healthz/favicon.ico|.well-known/|robots.txt|sitemap|.*\\..*).*)',
  ],
};