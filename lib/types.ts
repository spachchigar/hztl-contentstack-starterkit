import { ComponentProps } from './component-props';

// Description: Type definitions for the Contentstack API
export interface IExtendedProps {
  extendedProps?: Record<string, any>;
}

export type GetEntries = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  siteName?: string;
  locale?: string;
};

export type GetEntryByUid = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  entryUid: string;
  siteName?: string;
  locale?: string;
};

export type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export enum Devices {
  TOUCH = 'mobile',
  NON_TOUCH = 'desktop',
}

export type WithStandardComponentWrapperProps<P> = P & ComponentProps;
