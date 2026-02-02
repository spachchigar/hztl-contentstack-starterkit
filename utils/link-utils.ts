import { parseUrlObject, UrlWithRelativePath } from './string-utils';

export interface ParsedLink {
  shouldRender: boolean;
  isInternalAnchor: boolean;
  isCustomProtocol: boolean;
  realText: string;
  parsedUrl?: UrlWithRelativePath;
}

// Simplified Contentstack link field structure
export interface ContentstackLinkField {
  title?: string;
  href?: string;  // or 'url' depending on your Contentstack schema
}

export function parseLink(
  field?: ContentstackLinkField,
  children?: React.ReactNode,
  showLinkTextWithChildrenPresent?: boolean
): ParsedLink {
  const url = field?.href ?? '';
  const title = field?.title ?? '';

  // If no URL, don't render
  if (!url) {
    return {
      shouldRender: false,
      isInternalAnchor: false,
      isCustomProtocol: false,
      realText: ''
    };
  }

  // Detect if it's a hash-only anchor (e.g., "#contact" but not "/page#contact")
  const isInternalAnchor = url.startsWith('#') && !url.includes('/');

  // Detect custom protocols (tel:, mailto:, etc.) but exclude http/https
  const isCustomProtocol = /^[a-z][a-z0-9\+\-\.]+\:/i.test(url) && !url.startsWith('http');

  // Parse the URL
  let parsedUrl: UrlWithRelativePath | null = null;

  if (isInternalAnchor) {
    // Hash-only anchor - create manual object
    parsedUrl = {
      href: url,
      hash: url,
      host: '',
      hostname: '',
      origin: '',
      password: '',
      pathname: '',
      port: '',
      protocol: '',
      search: '',
      searchParams: new URLSearchParams(),
      username: '',
      toJSON: function (): string {
        return JSON.stringify({ ...this, toJSON: undefined });
      },
    } as UrlWithRelativePath;
  } else if (isCustomProtocol) {
    // Custom protocol - create manual object
    parsedUrl = {
      href: url,
      hash: '',
      host: '',
      hostname: '',
      origin: '',
      password: '',
      pathname: '',
      port: '',
      protocol: url.split(':')[0] + ':',
      search: '',
      searchParams: new URLSearchParams(),
      username: '',
      toJSON: function (): string {
        return JSON.stringify({ ...this, toJSON: undefined });
      },
    } as UrlWithRelativePath;
  } else {
    // Normal link (internal or external, with or without hash) - parse it
    parsedUrl = parseUrlObject(url);
  }

  // If URL parsing failed, don't render
  if (!parsedUrl) {
    return {
      shouldRender: false,
      isInternalAnchor: false,
      isCustomProtocol: false,
      realText: ''
    };
  }

  // Determine display text
  const realText = getRealText(title, showLinkTextWithChildrenPresent, children, parsedUrl);

  return {
    shouldRender: true,
    isInternalAnchor,
    isCustomProtocol,
    realText,
    parsedUrl
  };
}

function getRealText(
  title: string,
  showLinkTextWithChildrenPresent: boolean | undefined,
  children: React.ReactNode,
  parsedUrl: UrlWithRelativePath
): string {
  // If children exist and we shouldn't show text, return empty
  const showText = showLinkTextWithChildrenPresent || !children;
  if (!showText) {
    return '';
  }

  // If title exists, use it
  if (title) {
    return title;
  }

  // Otherwise use the URL (without leading slash for internal links)
  return parsedUrl.href?.startsWith('/')
    ? parsedUrl.href.slice(1)
    : parsedUrl.href ?? '';
}

export const getScriptUrl = (isNormalMode: boolean, datasource: any): string => {
  const publicUrl = isNormalMode ? '' : process.env.PUBLIC_URL;
  let datasourcePath = datasource.rendering.dataSource;
  if (datasourcePath && datasourcePath[0] !== '/') {
    datasourcePath = `/${datasourcePath}`;
  }
  return `${publicUrl}/api/script${datasourcePath}.js`;
};