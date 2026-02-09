// Importing Contentstack SDK and specific types for query operations
import contentstack, { QueryOperation } from '@contentstack/delivery-sdk';

// Importing type definitions
import { GetEntries, GetEntryByUid } from '../types';
import { IFooter, IHeader, ISiteSettings } from '@/.generated';

// Importing stack instance and language helpers
import { stack } from './delivery-stack';
import { getCurrentLanguage } from './language';
import { addEditableTagsIfPreview, addEditableTagsToEntries } from './preview-helpers';
import { cache } from 'react';
import { DEFAULT_LOCALE } from '@/constants/locales';

/**
 * Function to fetch page data based on the URL with multisite support
 * @param url - The URL to fetch the page for
 * @param pageType - The content type UID (default: 'page')
 * @returns The fetched page entry or undefined
 */
export const getPage = cache(async <T>(url: string, pageType: string, locale: string) => {
  const query = stack
    .contentType(pageType) // Specifying the content type as "page"
    .entry() // Accessing the entry
    .locale(locale)// Add locale specification
    .query() // Creating a query
    .addParams({ include_all: true, include_all_depth: 2, include_dimension: true }) // Using a safe limit of 5 depth for include_all. Max is 100
    .where('url', QueryOperation.EQUALS, url.toLowerCase()); // Filtering entries by URL

  const result = await query.find<T & contentstack.Utils.EntryModel>(); // Executing the query and expecting a result of type Page
  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, pageType, locale); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
})

/**
 * Function to fetch header entry
 * @returns The fetched header entry or undefined
 */
export const getHeader = cache(async (locale: string) => {
  const result = await stack
    .contentType('header') // Specifying the content type as "header"
    .entry() // Accessing the entry
    .locale(locale)
    .query() // Creating a query
    .addParams({ include_dimension: true })
    .find<IHeader>(); // Executing the query and expecting a result of type Header

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, 'header', locale); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
})

/**
 * Function to fetch footer entry
 * @returns The fetched footer entry or undefined
 */
export const getFooter = cache(async (locale: string) => {
  const result = await stack
    .contentType('footer') // Specifying the content type as "footer"
    .entry() // Accessing the entry
    .locale(locale)
    .query() // Creating a query
    .addParams({ include_dimension: true })
    .find<IFooter>(); // Executing the query and expecting a result of type Footer

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, 'footer', locale); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
})

/**
 * Function to fetch multiple entries of a content type
 * @param params - Object containing contentTypeUid, referencesToInclude, and locale
 * @returns The fetched entries or undefined
 */
export const getEntries = cache(async <T>({
  contentTypeUid,
  referencesToInclude = '',
  locale,
}: Pick<GetEntries, 'contentTypeUid' | 'referencesToInclude' | 'locale'>) => {
  if (!contentTypeUid) return;
  try {
    const entryQuery = stack.contentType(contentTypeUid).entry();

    // Include references if specified
    if (referencesToInclude) {
      entryQuery.includeReference(referencesToInclude);
    }

    // Use provided locale or fall back to singleton instance
    const localeToUse = locale || getCurrentLanguage();

    const entries = await entryQuery
      .locale(localeToUse)
      .includeFallback()
      .query()
      .find<T & contentstack.Utils.EntryModel>();

    // Add editable tags for live preview if enabled
    if (entries.entries) {
      addEditableTagsToEntries(entries.entries, contentTypeUid);
    }

    return entries;
  } catch (err) {
    throw err;
  }
});

/**
 * Function to fetch all slugs for a content type
 * @param params - Object containing contentTypeUid and locale
 * @returns The fetched slugs or undefined
 */
export const getAllSlugs = cache(async <T>({
  contentTypeUid = 'page',
  locale,
}: Pick<GetEntries, 'contentTypeUid'> & { locale?: string }) => {
  if (!contentTypeUid) return;
  try {
    const localeToUse = locale || getCurrentLanguage();
    const slugs = await stack
      .contentType(contentTypeUid)
      .entry()
      .locale(localeToUse)
      .only('url')
      .query()
      .find<T & contentstack.Utils.EntryModel>();

    return slugs;
  } catch (err) {
    throw err;
  }
});

/**
 * Fetches site settings entry from Contentstack
 * @param contentTypeUid - The content type UID for site settings (default: 'site_settings')
 * @returns The site settings entry if found, or undefined if no entry exists or an error occurs
 */
export const getSiteSettings = cache(async (contentTypeUid: string = 'site_settings'): Promise<(ISiteSettings & contentstack.Utils.EntryModel) | undefined> => {
  if (!contentTypeUid) {
    console.warn('getSiteSettings: contentTypeUid is required');
    return undefined;
  }

  try {
    const siteSettings = await stack
      .contentType(contentTypeUid)
      .entry()
      .locale(DEFAULT_LOCALE)
      .query()
      .find<ISiteSettings & contentstack.Utils.EntryModel>();

    if (siteSettings.entries && siteSettings.entries.length > 0) {
      const entry = siteSettings.entries[0];
      return entry;
    }

    console.warn(`getSiteSettings: No site settings entry found for content type "${contentTypeUid}"`);
    return undefined;
  } catch (err) {
    console.error(`Error while fetching site settings for content type "${contentTypeUid}":`, err);
    throw err;
  }
});

/**
 * Function to fetch a single entry by UID
 * @param params - Object containing contentTypeUid, entryUid, and referencesToInclude
 * @returns The fetched entry or undefined
 */
export const getEntryByUid = cache(async ({
  contentTypeUid,
  entryUid,
  referencesToInclude = '',
  locale,
}: Pick<GetEntryByUid, 'contentTypeUid' | 'entryUid' | 'referencesToInclude' | 'locale'>) => {
  if (!entryUid || !contentTypeUid) return;
  try {
    const entryQuery = stack.contentType(contentTypeUid).entry(entryUid);

    // Include references if specified
    if (referencesToInclude) {
      entryQuery.includeReference(referencesToInclude);
    }

    const entry = await entryQuery.locale(locale || getCurrentLanguage()).fetch();
    addEditableTagsIfPreview(entry, contentTypeUid, locale || getCurrentLanguage()); // Adding editable tags for live preview if enabled
    return entry;
  } catch (err) {
    console.error(`Error while fetching entry for ${entryUid} in ${contentTypeUid}`);
    throw err;
  }
});

/**
 * Function to fetch multiple entries by their UIDs
 * @param params - Object containing contentTypeUid, entryUids, referencesToInclude, and locale
 * @returns The fetched entries sorted by the order of entryUids or undefined
 */
export const getEntriesByUids = cache(async <T>({
  contentTypeUid,
  entryUids,
  referencesToInclude,
  locale,
}: {
  entryUids?: string | Array<string>;
  locale?: string;
} & Pick<GetEntryByUid, 'contentTypeUid' | 'referencesToInclude'>) => {
  if (!entryUids || !contentTypeUid) return;

  try {
    const entry = stack.contentType(contentTypeUid).entry();

    // Include references if specified
    if (referencesToInclude) {
      entry.includeReference(referencesToInclude);
    }

    // Use provided locale or fall back to singleton instance
    const localeToUse = locale || getCurrentLanguage();
    let entryQuery = entry.locale(localeToUse).query();

    // Filter entries by the provided UIDs using whereIn operator
    entryQuery = entryQuery.where('uid', QueryOperation.INCLUDES, entryUids);

    const response = await entryQuery.find<T & contentstack.Utils.EntryModel>();

    // Sort the entries based on the original order of entryUids
    if (response.entries && Array.isArray(response.entries) && Array.isArray(entryUids)) {
      // Early return if no reordering is needed
      if (entryUids.length <= 1 || response.entries.length <= 1) {
        // Add editable tags for live preview if enabled
        addEditableTagsToEntries(response.entries, contentTypeUid);
        return response;
      }

      // Create a Map for O(1) lookup instead of O(n) find operations
      const entryMap = new Map<string, (typeof response.entries)[number]>();
      for (const entry of response.entries) {
        entryMap.set((entry as any).uid, entry);
      }

      // Build sorted array using Map lookup - O(n) instead of O(n²)
      const sortedEntries: typeof response.entries = [];
      for (const uid of entryUids) {
        const entry = entryMap.get(uid);
        if (entry) {
          sortedEntries.push(entry);
        }
      }

      response.entries = sortedEntries;

      // Add editable tags after sorting (single pass, more efficient)
      addEditableTagsToEntries(response.entries, contentTypeUid);
    }

    return response;
  } catch (err) {
    console.error(`Error while fetching entries for UIDs ${entryUids} in ${contentTypeUid}`);
    throw err;
  }
});
