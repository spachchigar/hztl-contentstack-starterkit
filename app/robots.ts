import { getSiteSettings } from '@/lib/contentstack/entries';
import { MetadataRoute } from 'next';

/**
 * Generates robots.txt file for the site
 * @returns Robots configuration with rules and sitemap URL
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    // Default fallback robots if CMS fails or no settings found
    const defaultRobots: MetadataRoute.Robots = {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/private/',
            },
        ],
        sitemap: sitemapUrl,
    };

    try {
        const siteSettings = await getSiteSettings();

        if (!siteSettings || !siteSettings.robots_file_setting) {
            console.warn('[Robots] No site settings or robots_file_setting found, using default robots');
            return defaultRobots;
        }

        // Map CMS rules to Next.js MetadataRoute.Robots format
        const rules: Array<{ userAgent: string; allow?: string; disallow?: string; crawlDelay?: number }> = [];

        for (const rule of siteSettings.robots_file_setting) {
            // Validate and skip invalid rules
            if (!rule || !rule.user_agent) {
                console.warn('[Robots] Skipping invalid rule:', rule);
                continue;
            }

            const mappedRule: { userAgent: string; allow?: string; disallow?: string; crawlDelay?: number } = {
                userAgent: rule.user_agent,
            };

            // Only include allow if it exists and is valid
            if (rule.allow && typeof rule.allow === 'string') {
                mappedRule.allow = rule.allow;
            }

            // Only include disallow if it exists and is valid
            if (rule.disallow && typeof rule.disallow === 'string') {
                mappedRule.disallow = rule.disallow;
            }

            // Only include crawlDelay if it exists and is a valid number
            if (rule.crawl_delay !== undefined && rule.crawl_delay !== null) {
                const crawlDelay = Number(rule.crawl_delay);
                if (!isNaN(crawlDelay) && crawlDelay >= 0) {
                    mappedRule.crawlDelay = crawlDelay;
                }
            }

            rules.push(mappedRule);
        }

        // If no valid rules were found, use default
        if (rules.length === 0) {
            console.warn('[Robots] No valid rules found in site settings, using default robots');
            return defaultRobots;
        }

        return {
            rules: rules,
            sitemap: sitemapUrl,
        };
    } catch (error) {
        console.error('[Robots] Error generating robots.txt:', error instanceof Error ? error.message : error);
        return defaultRobots;
    }
}