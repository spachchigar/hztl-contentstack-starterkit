import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getEntriesByUids } from '../contentstack/entries';
import { toPascalCase } from '@/utils/string-utils';
import { ISystemFields } from '@/.generated';
import { isLanguageSupported } from '../contentstack/language';
import { DEFAULT_LOCALE } from '@/constants/locales';

interface UseEntryDataParams {
  references: Array<ISystemFields>;
  skip?: boolean;
  referencesToInclude?: string | Array<string>;
}

type EntryDataType<T> = {
  componentName: string;
  componentId: string;
  data: T | undefined;
};

type EntriesDataType<T> = Array<EntryDataType<T>>;
interface UseEntryDataResult<T> {
  data: EntriesDataType<T> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch entry data from Contentstack for multiple references
 * @param params Object containing references array
 * @returns Object with data array, loading state, error, and refetch function
 */
export const useGetEntriesByUids = <T = any>({
  references = [],
  skip = false,
  referencesToInclude = '',
}: UseEntryDataParams): UseEntryDataResult<T> => {
  const [data, setData] = useState<EntriesDataType<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);
  const params = useParams();

  // Get language from URL params (client-side)
  const locale = params?.locale as string | undefined;
  const language = locale && isLanguageSupported(locale) ? locale : DEFAULT_LOCALE;

  // Create stable keys for array dependencies to prevent infinite loops
  // Stringify arrays so we compare by content, not by reference
  const referencesKey = JSON.stringify(references);
  const referencesToIncludeKey = Array.isArray(referencesToInclude)
    ? JSON.stringify(referencesToInclude)
    : referencesToInclude;

  const fetchData = useCallback(async () => {
    if (references.length === 0 || skip) {
      setLoading(false);
      return;
    }

    let entriesData: EntriesDataType<T> | undefined;

    try {
      setLoading(true);

      // Group references by content type
      const referencesByContentType = references.reduce(
        (acc, ref) => {
          if (!ref._content_type_uid || !ref.uid) return acc;

          const contentType = ref._content_type_uid;

          if (!acc[contentType]) {
            acc[contentType] = [];
          }

          acc[contentType].push(ref.uid);

          return acc;
        },
        {} as Record<string, string[]>
      );

      // Create an array of promises for each content type
      const entryPromises = Object.entries(referencesByContentType).map(
        async ([contentTypeUid, uids]) => {
          const response = await getEntriesByUids({
            contentTypeUid,
            entryUids: uids, // Pass array of UIDs
            referencesToInclude,
            locale: language, // Pass language from URL params
          });

          // If no entries found, return empty array
          if (!response) return [];

          // Map each entry to the required format
          return response.entries?.map((entryData) => ({
            componentName: toPascalCase(contentTypeUid),
            componentId: contentTypeUid,
            data: entryData as T,
          }));
        }
      );

      // Wait for all promises and flatten the results
      const results = await Promise.all(entryPromises);
      entriesData = results.flat() as unknown as EntriesDataType<T>;

      setData(entriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching entry data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch entry data'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [references, skip, referencesToInclude, language]);

  useEffect(() => {
    fetchData();
    // Dependencies use stringified versions to prevent infinite loops when array references change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referencesKey, skip, referencesToIncludeKey, language]);

  return { data, loading, error, refetch: fetchData };
};
