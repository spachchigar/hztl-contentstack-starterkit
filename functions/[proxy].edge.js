/**
 * Edge function handler that processes incoming requests and applies redirect rules.
 *
 * This handler acts as a proxy middleware that:
 * 1. Checks if redirect functionality is enabled via environment variable
 * 2. Fetches redirect rules from the `/api/redirect` endpoint
 * 3. Matches the current request pathname against redirect rules
 * 4. Returns appropriate redirect responses (301/302) or passes through the request
 *
 * @param {Request} request - The incoming HTTP request object from the edge runtime
 * @returns {Promise<Response>} Returns either:
 *   - A redirect Response (301/302) if a matching rule is found
 *   - The result of fetch(request) if no redirect matches or redirects are disabled
 *
 * @example
 * // Request to /old-page will redirect to /new-page if a rule exists
 * // Request to /api/data will pass through without redirect check
 *
 * @remarks
 * - Requires ENABLE_REDIRECTS environment variable set to 'true' to activate
 * - Skips redirect checks for: API routes (/api/*), Next.js internals (/_next/*),
 *   static files (/static/*), and any path containing a dot (file extensions)
 * - Supports both internal (relative paths) and external (full URLs) redirects
 * - Default redirect status code is 301 (Permanent Redirect)
 * - On error, falls back to passing through the request to prevent site breakage
 */
export default async function handler(request) {
  const currentUrl = new URL(request.url);
  const pathname = currentUrl.pathname;

  try {
    // Check if redirects are enabled via environment variable
    // eslint-disable-next-line no-undef
    const redirectsEnabled = process.env.ENABLE_REDIRECTS === 'true';

    if (!redirectsEnabled) {
      return fetch(request);
    }

    // Skip redirect check for API routes, Next.js internals, static files, and files with extensions
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/static/') ||
      pathname.includes('.')
    ) {
      return fetch(request);
    }

    // Fetch redirect rules from API
    const apiUrl = `${currentUrl.protocol}//${currentUrl.host}/api/redirect`;

    const response = await fetch(new Request(apiUrl, request));
    const redirects = response.ok ? await response.json() : [];

    if (!response.ok) {
      console.error(`❌ Failed to fetch redirects: ${response.status} ${response.statusText}`);
    }

    // Find matching redirect rule
    const redirect = redirects.find((rule) => rule.source === pathname);

    if (redirect) {
      // Check if destination is a full URL (external redirect)
      let redirectUrl;
      const isExternalRedirect =
        redirect.destination.startsWith('http://') || redirect.destination.startsWith('https://');

      if (isExternalRedirect) {
        redirectUrl = redirect.destination;
      } else {
        // Internal redirect - construct URL relative to current origin
        const newUrl = new URL(request.url);
        newUrl.pathname = redirect.destination;
        redirectUrl = newUrl.toString();
      }

      return new Response(null, {
        status: redirect.status || 301,
        headers: {
          Location: redirectUrl,
        },
      });
    }

    return fetch(request);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    console.error(`❌ Error processing ${pathname}:`, errorMessage);
    console.error(`❌ Error stack:`, errorStack);

    // Return the original request on error to prevent breaking the site
    return fetch(request);
  }
}
