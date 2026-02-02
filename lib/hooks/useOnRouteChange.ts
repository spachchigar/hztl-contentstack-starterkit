'use client';

// Global
// import { RouterEvent, useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Hook to run a callback when the route changes in Next.js App Router
 * @param callback - Function to execute on route change
 * @param runOnHashChange - Whether to also run on hash changes
 */
export const useOnRouteChange = (
  callback: () => void,
  runOnHashChange = false
) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Run callback when pathname or search params change (but not on initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    callbackRef.current();
  }, [pathname, searchParams]) // Removed callback from deps!

  // Handle hash changes separately
  useEffect(() => {
    if (!runOnHashChange) return;

    const handleHashChange = () => {
      callbackRef.current();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [runOnHashChange]); // Removed callback from deps!
};

export function useOnHashChange(callback: () => void) {
  return useOnRouteChange(callback, true);
}
