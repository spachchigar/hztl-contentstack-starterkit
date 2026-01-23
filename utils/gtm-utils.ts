/**
 * Google Tag Manager DataLayer Utilities
 * OOP approach using GTMDataLayer class to manage GTM events and data
 */

import { generateGUID, hashSHA256 } from './string-utils';

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

// GTM DataLayer item interface
interface DataLayerItem {
  event: string;
  [key: string]: any;
}

type ContentGroup = 'page' | 'form';

/**
 * GTMDataLayer class - Manages Google Tag Manager data layer operations
 */
class GTMDataLayer {
  private dataLayer: Record<string, any>[];

  constructor() {
    this.dataLayer = this.initializeDataLayer();
  }

  /**
   * Initialize the dataLayer on the window object
   * @returns The dataLayer array
   */
  private initializeDataLayer(): Record<string, any>[] {
    if (typeof window !== 'undefined') {
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
      return window.dataLayer;
    }
    return [];
  }

  /**
   * Push data to GTM dataLayer
   * @param data - The data object to push
   */
  public push(data: DataLayerItem): void {
    if (typeof window !== 'undefined' && this.dataLayer) {
      this.dataLayer.push(data);
    }
  }

  /**
   * Hash form data for privacy
   * @param data - The data object to hash
   * @returns The hashed data object
   */
  private hashFormData(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, hashSHA256(value)]));
  }

  /**
   * Get event details with generated ID and content group
   * @param contentGroup - The content group type
   * @returns Event details object
   */
  private getEventDetails(contentGroup: ContentGroup): {
    event_id: string;
    content_group: ContentGroup;
  } {
    return {
      event_id: generateGUID(),
      content_group: contentGroup,
    };
  }

  private removeInternalFields(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(Object.entries(data).filter(([key]) => !key.startsWith('_')));
  }

  /**
   * Track a page view event
   */
  public trackPageView(): void {
    const pageViewData = {
      event: 'page_view',
      ecommerce: {
        event_details: this.getEventDetails('page'),
      },
    };

    this.push(pageViewData);
  }

  /**
   * Track a form submission event
   * @param eventType - The type of event to track
   * @param data - Additional form data to include
   */
  public trackFormSubmission(eventType: string, data: Record<string, any> = {}): void {
    const cleanedData = this.removeInternalFields(data);
    const leadData = {
      event: eventType,
      ecommerce: {
        event_details: this.getEventDetails('form'),
        user_hashed_data: this.hashFormData(cleanedData),
      },
      enhanced_conversion_data: cleanedData,
    };

    this.push(leadData);
  }

  /**
   * Get the current dataLayer
   * @returns The current dataLayer array
   */
  public getDataLayer(): Record<string, any>[] {
    return this.dataLayer;
  }
}

// Create a singleton instance
export const dataLayerInstance = new GTMDataLayer();
