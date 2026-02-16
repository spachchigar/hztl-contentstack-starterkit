import { IPage } from "@/.generated";
import { DEFAULT_LOCALE } from "@/constants/locales";
import { getEntries } from "@/lib/contentstack/entries";
import { getCurrentLanguage } from "@/lib/contentstack/language";
import { getEntryLocales } from "@/lib/contentstack/management-stack";
import { MetadataRoute } from "next";

// Revalidate sitemap every hour
export const revalidate = 3600;

// Valid changeFrequency values per sitemap protocol
const VALID_CHANGE_FREQUENCIES = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] as const;

/**
 * Validates and clamps priority value between 0.0 and 1.0
 */
function validatePriority(priority: number | null | undefined): number {
    if (priority === undefined || priority === null) return 0.5;
    return Math.max(0, Math.min(1, priority));
}

/**
 * Validates changeFrequency against allowed values
 */
function validateChangeFrequency(frequency: string | undefined): MetadataRoute.Sitemap[number]['changeFrequency'] {
    if (!frequency) return 'daily';
    return VALID_CHANGE_FREQUENCIES.includes(frequency as any)
        ? frequency as MetadataRoute.Sitemap[number]['changeFrequency']
        : 'daily';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapArray: MetadataRoute.Sitemap = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Validate base URL is configured
    if (!baseUrl) {
        console.error('[Sitemap] NEXT_PUBLIC_BASE_URL is not configured');
        return [];
    }

    const currentLocale = getCurrentLanguage();

    try {
        // Fetch all pages for current locale
        const allPages = await getEntries<IPage>({
            contentTypeUid: 'page',
            locale: currentLocale
        });

        if (!allPages?.entries || allPages.entries.length === 0) {
            console.warn('[Sitemap] No pages found for locale:', currentLocale);
            return [];
        }

        // Batch fetch all entry locales for better performance
        const localePromises = allPages.entries.map(page =>
            getEntryLocales(page.uid, 'page').catch(error => {
                console.error(`[Sitemap] Failed to fetch locales for page ${page.uid}:`, error);
                return null;
            })
        );
        const allPageLocales = await Promise.all(localePromises);

        // Build sitemap entries
        for (let i = 0; i < allPages.entries.length; i++) {
            const page = allPages.entries[i];
            const pageLocales = allPageLocales[i];

            // Skip pages without URL
            if (!page.url) {
                console.warn(`[Sitemap] Skipping page ${page.uid} - missing URL`);
                continue;
            }

            // Build page URL based on locale
            const pageUrl = currentLocale === DEFAULT_LOCALE
                ? `${baseUrl}${page.url}`
                : `${baseUrl}/${currentLocale}${page.url}`;

            // Initialize page sitemap object with validated values
            const pageSitemapObject: MetadataRoute.Sitemap[number] = {
                url: pageUrl,
                lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
                changeFrequency: validateChangeFrequency(page.page_sitemap_setting?.change_frequency),
                priority: validatePriority(page.page_sitemap_setting?.priority),
            };

            // Build language alternates if locales exist
            if (pageLocales?.locales && pageLocales.locales.length > 0) {
                const languageUrls: Record<string, string> = {};

                for (const locale of pageLocales.locales) {
                    // Skip non-localized locales (except default)
                    if (locale.code !== DEFAULT_LOCALE && !locale.localized) continue;

                    // Build URL for this locale
                    const localeUrl = locale.code === DEFAULT_LOCALE
                        ? `${baseUrl}${page.url}`
                        : `${baseUrl}/${locale.code}${page.url}`;

                    languageUrls[locale.code as string] = localeUrl;
                }

                // Only add alternates if we have language URLs
                if (Object.keys(languageUrls).length > 0) {
                    pageSitemapObject.alternates = {
                        languages: languageUrls
                    };
                }
            }

            sitemapArray.push(pageSitemapObject);
        }

        return sitemapArray;

    } catch (error) {
        console.error('[Sitemap] Error generating sitemap:', error);
        // Return empty array on error to prevent sitemap from breaking
        return [];
    }
}