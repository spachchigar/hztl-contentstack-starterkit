// Global
import contentstack, { QueryOperation } from '@contentstack/delivery-sdk';
import { cache } from 'react';

// Local
import { GetEntries, GetEntryByUid } from '../types';
import { IFooter, IHeader, ISiteSettings } from '@/.generated';
import { stack } from './delivery-stack';
import { getCurrentLanguage } from './language';
import { addEditableTagsIfPreview, addEditableTagsToEntries } from './preview-helpers';
import { DEFAULT_LOCALE } from '../../constants/locales';

/**
 * Function to fetch page data based on the URL with multisite support
 * @param url - The URL to fetch the page for
 * @param pageType - The content type UID (default: 'page')
 * @returns The fetched page entry or undefined
 */
export const getPage = cache(async <T>(url: string, pageType: string, locale: string) => {
  if (!url || !pageType || !locale) return undefined;

  try {
    const query = stack
      .contentType(pageType)
      .entry()
      .locale(locale)
      .query()
      .addParams({ include_all: true, include_all_depth: 2, include_dimension: true })
      .where('url', QueryOperation.EQUALS, url.toLowerCase());

    const result = await query.find<T & contentstack.Utils.EntryModel>();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      addEditableTagsIfPreview(entry, pageType, locale);
      return entry;
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching page for URL "${url}" (${pageType}, ${locale}):`, err);
    return undefined;
  }
});

/**
 * Function to fetch header entry
 * @returns The fetched header entry or undefined
 */
export const getHeader = cache(async (locale: string) => {
  if (!locale) return undefined;

  try {
    const result = await stack
      .contentType('header')
      .entry()
      .locale(locale)
      .query()
      .addParams({ include_dimension: true })
      .find<IHeader>();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      addEditableTagsIfPreview(entry, 'header', locale);
      return entry;
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching header for locale "${locale}":`, err);
    return undefined;
  }
});

/**
 * Function to fetch footer entry
 * @returns The fetched footer entry or undefined
 */
export const getFooter = cache(async (locale: string) => {
  if (!locale) return undefined;

  try {
    const result = await stack
      .contentType('footer')
      .entry()
      .locale(locale)
      .query()
      .addParams({ include_dimension: true })
      .find<IFooter>();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      addEditableTagsIfPreview(entry, 'footer', locale);
      return entry;
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching footer for locale "${locale}":`, err);
    return undefined;
  }
});

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
  if (!contentTypeUid) return undefined;

  try {
    const entryQuery = stack.contentType(contentTypeUid).entry();

    if (referencesToInclude) {
      entryQuery.includeReference(referencesToInclude);
    }

    const localeToUse = locale || getCurrentLanguage();

    const entries = await entryQuery
      .locale(localeToUse)
      .includeFallback()
      .query()
      .find<T & contentstack.Utils.EntryModel>();

    if (entries.entries) {
      addEditableTagsToEntries(entries.entries, contentTypeUid);
    }

    return entries;
  } catch (err) {
    console.error(`Error while fetching entries for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`, err);
    return undefined;
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
  if (!contentTypeUid) return undefined;

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
    console.error(`Error while fetching slugs for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`, err);
    return undefined;
  }
});

/**
 * Fetches site settings entry from Contentstack
 * @param contentTypeUid - The content type UID for site settings (default: 'site_settings')
 * @returns The site settings entry if found, or undefined if no entry exists or an error occurs
 */
export const getSiteSettings = cache(async (contentTypeUid: string = 'site_settings'): Promise<(ISiteSettings & contentstack.Utils.EntryModel) | undefined> => {
  if (!contentTypeUid) return undefined;


  try {
    const siteSettings = await stack
      .contentType(contentTypeUid)
      .entry()
      .locale(DEFAULT_LOCALE)
      .query()
      .find<ISiteSettings & contentstack.Utils.EntryModel>();

    if (siteSettings.entries && siteSettings.entries.length > 0) {
      return siteSettings.entries[0];
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching site settings for content type "${contentTypeUid}":`, err);
    return undefined;
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
  if (!entryUid || !contentTypeUid) return undefined;

  try {
    const entryQuery = stack.contentType(contentTypeUid).entry(entryUid);

    if (referencesToInclude) {
      entryQuery.includeReference(referencesToInclude);
    }

    const localeToUse = locale || getCurrentLanguage();
    const entry = await entryQuery.locale(localeToUse).fetch();
    addEditableTagsIfPreview(entry, contentTypeUid, localeToUse);
    return entry;
  } catch (err) {
    console.error(`Error while fetching entry "${entryUid}" for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`, err);
    return undefined;
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
  if (!entryUids || !contentTypeUid) return undefined;

  try {
    const entry = stack.contentType(contentTypeUid).entry();

    if (referencesToInclude) {
      entry.includeReference(referencesToInclude);
    }

    const localeToUse = locale || getCurrentLanguage();
    let entryQuery = entry.locale(localeToUse).query();

    entryQuery = entryQuery.where('uid', QueryOperation.INCLUDES, entryUids);

    const response = await entryQuery.find<T & contentstack.Utils.EntryModel>();

    if (response.entries && Array.isArray(response.entries) && Array.isArray(entryUids)) {
      if (entryUids.length <= 1 || response.entries.length <= 1) {
        addEditableTagsToEntries(response.entries, contentTypeUid);
        return response;
      }

      const entryMap = new Map<string, (typeof response.entries)[number]>();
      for (const entry of response.entries) {
        entryMap.set((entry as any).uid, entry);
      }

      const sortedEntries: typeof response.entries = [];
      for (const uid of entryUids) {
        const entry = entryMap.get(uid);
        if (entry) {
          sortedEntries.push(entry);
        }
      }

      response.entries = sortedEntries;
      addEditableTagsToEntries(response.entries, contentTypeUid);
    }

    return response;
  } catch (err) {
    console.error(`Error while fetching entries for UIDs ${Array.isArray(entryUids) ? entryUids.join(', ') : entryUids} in content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`, err);
    return undefined;
  }
});
