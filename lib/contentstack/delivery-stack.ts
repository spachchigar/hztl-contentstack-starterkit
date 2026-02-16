// Importing Contentstack SDK
import contentstackDeliverySDK from '@contentstack/delivery-sdk';

// helper functions from private package to retrieve Contentstack endpoints in a convienient way
import { getContentstackEndpoints, getRegionForString } from '@timbenniks/contentstack-endpoints';

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'EU');

// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true);

// Cache preview mode check for performance
const isPreviewMode = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true';

// Shared function to create Contentstack stack configuration
export function createStack() {
  return contentstackDeliverySDK.stack({
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

// Export endpoints and preview mode for use in other modules
export function getEndpoints() {
  return endpoints;
}

export function isPreviewModeEnabled(): boolean {
  return isPreviewMode;
}
