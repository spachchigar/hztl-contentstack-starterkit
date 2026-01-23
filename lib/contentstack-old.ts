// Importing Contentstack SDK and specific types for region and query operations
import contentstack, { QueryOperation } from '@contentstack/delivery-sdk';

// Importing Contentstack Live Preview utilities and stack SDK
import ContentstackLivePreview, { IStackSdk } from '@contentstack/live-preview-utils';

// Importing the Page and Header type definitions
import { GetEntries, GetEntryByUid } from './types';
import { IFooter, IHeader } from '@/.generated';

// Importing the language service
import { LanguageService } from './services/language-service';

// helper functions from private package to retrieve Contentstack endpoints in a convienient way
import { getContentstackEndpoints, getRegionForString } from '@timbenniks/contentstack-endpoints';

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'EU');

// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true);

// Cache preview mode check for performance
const isPreviewMode = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true';

// Helper function to add editable tags for live preview (reduces code duplication)
function addEditableTagsIfPreview(entry: any, contentTypeUid: string): void {
  if (isPreviewMode) {
    contentstack.Utils.addEditableTags(entry, contentTypeUid, true);
  }
}

// Helper function to add editable tags to multiple entries
function addEditableTagsToEntries(entries: any[], contentTypeUid: string): void {
  if (isPreviewMode && entries) {
    entries.forEach((entry) => {
      contentstack.Utils.addEditableTags(entry, contentTypeUid, true);
    });
  }
}

// Shared function to create Contentstack stack configuration
export function createStack() {
  return contentstack.stack({
    // Setting the API key from environment variables
    apiKey: process.env.CONTENTSTACK_API_KEY as string,

    // Setting the delivery token from environment variables
    deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,

    // Setting the environment based on environment variables
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,

    // Setting the region based on environment variables
    region: region,
    live_preview: {
      // Enabling live preview if specified in environment variables
      enable: isPreviewMode,

      // Setting the preview token from environment variables
      preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,

      // Setting the host for live preview based on the region
      host: endpoints.preview,
    },
  });
}

// Export the stack instance for backward compatibility
export const stack = createStack();

// Initialize live preview functionality
export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: true, // Disabling server-side rendering for live preview
    enable: isPreviewMode, // Enabling live preview if specified in environment variables
    mode: 'builder', // Setting the mode to "builder" for visual builder
    stackSdk: stack.config as IStackSdk, // Passing the stack configuration
    stackDetails: {
      apiKey: process.env.CONTENTSTACK_API_KEY as string, // Setting the API key from environment variables
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string, // Setting the environment from environment variables
      branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,
    },
    clientUrlParams: {
      host: endpoints.application,
    },
    editButton: {
      enable: true, // Enabling the edit button for live preview
    },
  });
}

// Helper function to get current language
export function getCurrentLanguage(): string {
  return LanguageService.getInstance().getLanguage();
}

// Helper function to set current language
export function setCurrentLanguage(language: string): void {
  LanguageService.getInstance().setLanguage(language);
}

/**
 * Extract locale from params and set it as the current language
 * This helper reduces duplication across page components and generateMetadata
 * @param locale - The locale string from route params
 * @returns The resolved language code (defaults to 'en-us' if locale is not supported)
 */
export function extractAndSetLanguage(locale: string): string {
  const isLanguageParam = isLanguageSupported(locale);
  const language = isLanguageParam ? locale : 'en-us';
  setCurrentLanguage(language);
  return language;
}

export function isLanguageSupported(language: string): boolean {
  return LanguageService.getInstance().isLanguageSupported(language);
}

// Function to fetch page data based on the URL with multisite support
export async function getPage<T>(url: string, pageType: string) {
  const query = stack
    .contentType(pageType) // Specifying the content type as "page"
    .entry() // Accessing the entry
    .locale(LanguageService.getInstance().getLanguage()) // Add locale specification
    .query() // Creating a query
    .addParams({ include_all: true, include_all_depth: 5 }) // Using a safe limit of 5 depth for include_all. Max is 100
    .where('url', QueryOperation.EQUALS, url.toLowerCase()); // Filtering entries by URL

  const result = await query.find<T & contentstack.Utils.EntryModel>(); // Executing the query and expecting a result of type Page

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, pageType); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
}

export async function getHeader() {
  const result = await stack
    .contentType('header') // Specifying the content type as "header"
    .entry() // Accessing the entry
    .locale(LanguageService.getInstance().getLanguage())
    .query() // Creating a query
    .find<IHeader>(); // Executing the query and expecting a result of type Header

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, 'header'); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
}

export async function getFooter() {
  const result = await stack
    .contentType('footer') // Specifying the content type as "header"
    .entry() // Accessing the entry
    .locale(LanguageService.getInstance().getLanguage())
    .query() // Creating a query
    .find<IFooter>(); // Executing the query and expecting a result of type Header

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result
    addEditableTagsIfPreview(entry, 'footer'); // Adding editable tags for live preview if enabled
    return entry; // Returning the fetched entry
  }
  return undefined;
}

export const getEntries = async <T>({
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
    const localeToUse = locale || LanguageService.getInstance().getLanguage();

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
};

export const getAllSlugs = async <T>({
  contentTypeUid = 'page',
  locale,
}: Pick<GetEntries, 'contentTypeUid'> & { locale?: string }) => {
  if (!contentTypeUid) return;
  try {
    const localeToUse = locale || LanguageService.getInstance().getLanguage();
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
};

export const getEntryByUid = async ({
  contentTypeUid,
  entryUid,
  referencesToInclude = '',
}: Pick<GetEntryByUid, 'contentTypeUid' | 'entryUid' | 'referencesToInclude'>) => {
  if (!entryUid || !contentTypeUid) return;
  try {
    const entryQuery = stack.contentType(contentTypeUid).entry(entryUid);

    // Include references if specified
    if (referencesToInclude) {
      entryQuery.includeReference(referencesToInclude);
    }

    const entry = await entryQuery.locale(LanguageService.getInstance().getLanguage()).fetch();
    addEditableTagsIfPreview(entry, contentTypeUid); // Adding editable tags for live preview if enabled
    return entry;
  } catch (err) {
    console.error(`Error while fetching entry for ${entryUid} in ${contentTypeUid}`);
    throw err;
  }
};

export const getEntriesByUids = async <T>({
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
    const localeToUse = locale || LanguageService.getInstance().getLanguage();
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
};
