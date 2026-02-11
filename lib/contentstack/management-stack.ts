/**
 * Contentstack Management SDK Client
 * 
 * This module provides a configured client for interacting with the Contentstack Management API.
 * 
 * @module contentstack-management
 * 
 * @security WARNING: This module should ONLY be used in Node.js build scripts.
 * Never import this in browser-side code as it uses sensitive management tokens.
 * 
 * @requires CONTENTSTACK_MANAGEMENT_TOKEN - Management API token with appropriate permissions
 * @requires CONTENTSTACK_API_KEY - Stack API key
 * 
 * @see https://www.contentstack.com/docs/developers/apis/content-management-api/
 */

import * as contentstackManagementSDK from '@contentstack/management';
import { Locales } from '@contentstack/management/types/stack/contentType/entry';
import { Locale } from '@contentstack/management/types/stack/locale';
import { cache } from 'react';

/**
 * Configuration options for management client
 */
interface ManagementClientConfig {
    /**
     * Management API authentication token
     */
    authtoken: string;

    /**
     * Stack API key
     */
    apiKey: string;

    /**
     * Optional: API host URL (defaults to Contentstack's default)
     */
    host?: string;
}

/**
 * Validates required environment variables for management operations
 * 
 * @throws {Error} If required environment variables are missing
 */
function validateEnvironment(): void {
    const requiredVars = [
        'CONTENTSTACK_MANAGEMENT_TOKEN',
        'CONTENTSTACK_API_KEY',
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please ensure your .env file contains all required Contentstack credentials.'
        );
    }
}

/**
 * Creates and configures a Contentstack Management SDK client
 * 
 * This client is used for build-time operations such as:
 * - Fetching available locales/languages
 * - Querying content type schemas
 * - Accessing stack configuration
 * 
 * @returns Configured Contentstack management stack client
 * @throws {Error} If required environment variables are missing
 * 
 * @example
 *
 * const stack = createManagementClient();
 * const locales = await stack.locale().query().find();
 *  */
export async function createManagementClient() {
    // Validate environment variables first
    validateEnvironment();

    const config: ManagementClientConfig = {
        authtoken: "cs515a1571870fe46038dff9d0",
        apiKey: process.env.CONTENTSTACK_API_KEY!,
    };

    try {
        // Initialize management SDK client
        const client = contentstackManagementSDK.client();

        // Return stack instance for the specified API key
        const stack = client.stack({
            api_key: config.apiKey,
            management_token: config.authtoken,
        });

        return stack;
    } catch (error) {
        throw new Error(
            `Failed to initialize Contentstack Management client: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Fetches all available locales from the Contentstack stack
 * 
 * @returns Promise resolving to array of locale objects
 * @throws {Error} If API request fails
 * 
 * @example
 *
 * const locales = await fetchLocales();
 * console.log(`Found ${locales.length} locales`);
 *  */
export async function fetchLocales(): Promise<Locale[]> {
    try {
        const stack = await createManagementClient();

        // Query all locales from the stack
        const response = await stack.locale().query().find();

        if (!response || !response.items) {
            throw new Error('Invalid response structure from Contentstack API');
        }

        return response.items as Locale[];
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch locales from Contentstack: ${error.message}`);
        }
        throw new Error('Failed to fetch locales from Contentstack: Unknown error');
    }
}

/**
 * Checks if the management client can successfully connect to Contentstack
 * 
 * @returns Promise resolving to true if connection is successful
 * @throws {Error} If connection fails
 */
export async function testConnection(): Promise<boolean> {
    try {
        const stack = await createManagementClient();

        // Attempt to fetch locales as a connection test
        await stack.locale().query().find();

        return true;
    } catch (error) {
        throw new Error(
            `Contentstack Management API connection test failed: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Retrieves all available locales for a specific entry in Contentstack
 * 
 * This function queries the Contentstack Management API to get the list of locales
 * in which a particular entry has been published or exists.
 * 
 * @param entryUid - The unique identifier of the entry
 * @param contentTypeUid - The unique identifier of the content type (e.g., 'page', 'blog_post')
 * 
 * @returns An array of locale codes (e.g., ['en-us', 'fr-fr']) if locales exist,
 *          or an empty array if no locales are found or an error occurs
 **/
export const getEntryLocales = cache(async (
    entryUid: string,
    contentTypeUid: string) => {
    // Validate inputs
    if (!entryUid || !contentTypeUid) {
        console.error('getEntryLocales: entryUid and contentTypeUid are required');
        return undefined;
    }

    try {
        const stack = await createManagementClient();

        const locales: Locales = await stack
            .contentType(contentTypeUid)
            .entry(entryUid)
            .locales();

        // Return locales or undefined
        return locales || undefined;
    } catch (error) {
        console.error(
            `Failed to fetch locales for entry "${entryUid}" of type "${contentTypeUid}":`,
            error instanceof Error ? error.message : error
        );
        return undefined;

    }
})
