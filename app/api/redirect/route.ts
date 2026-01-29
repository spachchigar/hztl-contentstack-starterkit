/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getEntries } from '@/lib/contentstack/entries';
import { IRedirectMappings } from '@/.generated';

interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
  status: number;
}

// In-memory cache
// Note: This is a secondary cache. The primary cache is in the edge function.
// This cache helps when multiple requests hit the API route simultaneously
// or when the API route is called directly (bypassing edge function).
let cachedRedirects: RedirectRule[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (shorter than edge cache for better freshness)

export async function GET() {
  try {
    const now = Date.now();

    // Check if we have valid cached data
    if (cachedRedirects && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedRedirects, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cached': 'true',
          'X-Cached-At': new Date(cacheTimestamp).toISOString(),
          'X-Checked-At': new Date().toISOString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
        },
      });
    }

    // Fetch redirects from Contentstack
    const mappingEntries = await getEntries<IRedirectMappings>({
      contentTypeUid: 'redirect_mappings',
    });

    const rewrites =
      mappingEntries?.entries?.[0]?.mappings
        ?.filter((mapping: any) => mapping.status === 'Active')
        .map((mapping: any) => ({
          source: mapping.source,
          destination: mapping.destination,
          permanent: true,
          status: 301,
        })) || [];

    // Update cache
    cachedRedirects = rewrites;
    cacheTimestamp = now;

    // Always return 200 with an array, even if empty
    return NextResponse.json(rewrites, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cached': 'false',
        'X-Cached-At': new Date(cacheTimestamp).toISOString(),
        'X-Checked-At': new Date().toISOString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
      },
    });
  } catch (err) {
    console.error('[API] ❌ Rewrite API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[API] ❌ Error stack:', err instanceof Error ? err.stack : 'No stack trace');

    // If we have stale cache, return it during errors
    if (cachedRedirects && cachedRedirects.length > 0) {
      return NextResponse.json(cachedRedirects, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
          'X-Cached': 'true',
          'X-Stale': 'true',
          'X-Error': errorMessage,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Return empty array instead of error to prevent edge function failure
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
        'X-Error': errorMessage,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
    },
  });
}
