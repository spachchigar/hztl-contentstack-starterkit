// Importing Contentstack Live Preview utilities and stack SDK
import ContentstackLivePreview, { IStackSdk } from '@contentstack/live-preview-utils';

// Importing stack instance, endpoints, and preview mode check
import { stack, getEndpoints, isPreviewModeEnabled } from './stack';

/**
 * Initialize live preview functionality
 * This should be called once during application initialization
 */
export function initLivePreview() {
  const endpoints = getEndpoints();

  ContentstackLivePreview.init({
    ssr: true, // Enabling server-side rendering for live preview
    enable: isPreviewModeEnabled(), // Enabling live preview if specified in environment variables
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
