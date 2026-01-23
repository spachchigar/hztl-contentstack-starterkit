// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from '@/constants/locales';
import { LanguageService } from '@/lib/services/language-service';

const PUBLIC_FILE = /\.(.*)$/;
const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore public files, API routes, or Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
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

  // If first segment is a supported locale, allow it through
  if (SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    localeToUse = firstSegment as SupportedLocale;
    // Always update cookie to match URL locale for consistency
    shouldUpdateCookie = true;
    response = NextResponse.next();
  } else {
    // For paths without locale prefix, check for stored preference
    if (storedPreference) {
      // Use stored preference and redirect to include locale in URL (if not English)
      const baseLanguage = LanguageService.getBaseLanguage(storedPreference);
      const shouldShowInUrl = LanguageService.shouldShowLanguageInUrl(baseLanguage);

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
      // Update cookie to ensure it's set
      shouldUpdateCookie = true;
    } else {
      // No stored preference, use default (English)
      // Internally rewrite to default locale but keep URL clean (no prefix for English)
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
      response = NextResponse.rewrite(url);
      localeToUse = DEFAULT_LOCALE;
    }
  }

  // Update cookie if needed
  if (shouldUpdateCookie) {
    const baseLanguage = LanguageService.getBaseLanguage(localeToUse);
    const preferredLocale = LanguageService.getPreferredLocale(baseLanguage);
    response.cookies.set(LANGUAGE_PREFERENCE_COOKIE, preferredLocale, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
    });
  }

  // Add cache-control headers for SSR pages
  // public: allows CDNs and proxies to cache the response
  // max-age: how long the response is considered fresh
  // stale-while-revalidate: allows serving stale content while revalidating in background
  response.headers.set(
    'Cache-Control',
    `public, max-age=${process.env.CACHE_MAX_AGE || 3600}, stale-while-revalidate=${
      process.env.STALE_WHILE_REVALIDATE || 86400
    }`
  );

  // Set the current locale as a response header for debugging/CDN rules
  response.headers.set('X-Locale', localeToUse);

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
