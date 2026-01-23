// Importing Contentstack SDK for editable tags utilities
import contentstack from '@contentstack/delivery-sdk';

// Import preview mode check from stack module
import { isPreviewModeEnabled } from './stack';

/**
 * Helper function to add editable tags for live preview (reduces code duplication)
 * @param entry - The entry to add editable tags to
 * @param contentTypeUid - The content type UID
 */
export function addEditableTagsIfPreview(entry: any, contentTypeUid: string): void {
  if (isPreviewModeEnabled()) {
    contentstack.Utils.addEditableTags(entry, contentTypeUid, true);
  }
}

/**
 * Helper function to add editable tags to multiple entries
 * @param entries - Array of entries to add editable tags to
 * @param contentTypeUid - The content type UID
 */
export function addEditableTagsToEntries(entries: any[], contentTypeUid: string): void {
  if (isPreviewModeEnabled() && entries) {
    entries.forEach((entry) => {
      contentstack.Utils.addEditableTags(entry, contentTypeUid, true);
    });
  }
}
