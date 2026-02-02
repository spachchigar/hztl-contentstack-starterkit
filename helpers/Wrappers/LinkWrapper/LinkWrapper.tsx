// Global
import { sendGTMEvent } from '@next/third-parties/google';
import NextLink, { LinkProps } from 'next/link';
import React, { forwardRef, JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { ctaTailwindVariant } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { SvgIcon } from '@/helpers/SvgIcon';
import { GtmEvent } from '@/utils/gtm-utils';
import { parseLink } from '@/utils/link-utils';
import { CtaComponentClass, useCtaComponentClass } from '@/lib/hooks/theming/useCtaComponentClass';
import { IEnhancedLink } from '@/.generated';
import { CtaIcons } from '@/utils/style-param-utils/modules/ctas';


// Sitecore target options (from Content Editor dropdown)
const SITECORE_TARGET_OPTIONS = {
  ACTIVE_BROWSER: '_self', // Active Browser - same window
  CUSTOM: '|Custom', // Custom - no target attribute
  NEW_BROWSER: '_blank', // New Browser - new window/tab
} as const;

/**
 * Processes the target value from Sitecore
 * Returns undefined for custom targets (no target attribute)
 * Returns the original target for other values
 */
const processTargetValue = (target?: string): string | undefined => {
  // Handle cases where Sitecore appends "|Custom" to the actual target value
  if (target?.includes('|Custom')) {
    const actualTarget = target.replace('|Custom', '');
    // If the actual target is empty or just whitespace, return undefined (no target attribute)
    return actualTarget.trim() || undefined;
  }

  // Handle the case where target is exactly "|Custom"
  if (target === SITECORE_TARGET_OPTIONS.CUSTOM) {
    return undefined;
  }

  return target;
};

export type LinkWrapperProps = Partial<IEnhancedLink> & Partial<LinkProps> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  children?: React.ReactNode;
  className?: string;
  gtmEvent?: GtmEvent;
  srOnlyText?: string;
  suppressNewTabIcon?: boolean;
  ctaComponentClass?: CtaComponentClass | 'default';
  showLinkTextWithChildrenPresent?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  ctaStyle?: {
    ctaIcon?: CtaIcons;
    ctaVariant?: 'primary' | 'secondary' | 'tertiary' | 'link';
    ctaIconAlignment?: 'left' | 'right';
    ctaVisibility?: 'visible' | 'hidden';
  };
  ctaIcon?: CtaIcons;
  ctaVariant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  ctaIconAlignment?: 'left' | 'right';
  ctaVisibility?: 'visible' | 'hidden';
  field?: IEnhancedLink;
};

const linkWrapperTailwindVariant = tv({
  extend: ctaTailwindVariant,
  slots: {
    iconNewTab: ['align-middle', 'inline-flex', 'ml-2', 'flex-shrink-0', '-mt-px'],
  },
});

const LinkWrapper = forwardRef<HTMLAnchorElement, LinkWrapperProps>(
  (originalProps: LinkWrapperProps, ref): JSX.Element | null => {
    const {
      onClick,
      children,
      className,
      ctaStyle,
      ctaIcon: ctaIconOverride,
      ctaIconAlignment: ctaIconAlignmentOverride,
      ctaVariant: ctaVariantOverride,
      ctaVisibility: ctaVisibilityOverride,
      ctaComponentClass,
      link,
      target,
      gtmEvent,
      showLinkTextWithChildrenPresent = false,
      srOnlyText,
      suppressNewTabIcon,
      ...props
    } = originalProps;

    const ctaIcon = ctaIconOverride ?? ctaStyle?.ctaIcon;
    const ctaVariant = ctaVariantOverride ?? ctaStyle?.ctaVariant ?? 'link';
    const ctaIconAlignment = ctaIconAlignmentOverride ?? ctaStyle?.ctaIconAlignment ?? 'right';
    const ctaVisibility = ctaVisibilityOverride ?? ctaStyle?.ctaVisibility ?? 'visible';

    let effectiveCtaComponentClass = ctaComponentClass;
    if (effectiveCtaComponentClass === 'default') {
      effectiveCtaComponentClass =
        ctaVariant === 'primary'
          ? 'component-hero-button-color-1'
          : 'component-hero-button-color-2';
    }

    const style = useCtaComponentClass(effectiveCtaComponentClass);

    const { realText, shouldRender, isInternalAnchor, isCustomProtocol, parsedUrl } = parseLink(
      link,
      children,
      showLinkTextWithChildrenPresent
    );

    if (parsedUrl?.href?.startsWith('/')) {
      const normalizedPathname = parsedUrl.pathname.toLowerCase();
      const normalizedHref = `${normalizedPathname}${parsedUrl.search}${parsedUrl.hash}`;

      parsedUrl.pathname = normalizedPathname;
      parsedUrl.href = normalizedHref;
    }

    /*
     * RENDERING
     */

    const { base } = linkWrapperTailwindVariant({
      iconAlignment: ctaIconAlignment,
      variant: ctaVariant,
      visibility: ctaVisibility,
      style: style,
    });

    if (!shouldRender || !parsedUrl) {
      return <></>;
    }

    /*
     * EVENT HANDLERS
     */

    const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (link) {
        const gtmEventInner = {
          ...gtmEvent,
          'gtm.element.dataset.gtmLinkName': realText || link.title,
          'gtm.element.dataset.gtmLinkUrl': link.href,
        };

        sendGTMEvent(gtmEventInner);
      }

      if (onClick) onClick(e);
    };

    /*
     * Next/Link doesn't handle named anchors. At all. In the event that the user has defined a named anchor
     * (i.e. anchor has a value, href has no value, and linktype is "internal"),
     * then use a standard anchor tag to render the link.
     */
    if (isInternalAnchor || isCustomProtocol) {
      return (
        <a
          {...props}
          className={[className, base(), 'group'].join(' ')}
          data-component="helpers/sitecorewrappers/linkwrapper"
          href={isInternalAnchor ? parsedUrl.hash : parsedUrl.href}
          onClick={handleOnClick}
          ref={ref}
          title={link?.title || realText}
        >
          {!showLinkTextWithChildrenPresent ? (
            <span>
              {realText ||
                (parsedUrl.href?.startsWith('/') ? parsedUrl.href.slice(1) : parsedUrl.href)}
            </span>
          ) : (
            <span>{realText}</span>
          )}
          {children}
          <ScreenReaderOnlyTextAndNewTabIcon
            target={processTargetValue(target)}
            srOnlyText={srOnlyText}
            suppressNewTabIcon={suppressNewTabIcon}
            ctaIcon={ctaIcon}
            variant={ctaVariant}
            style={style}
          />
        </a>
      );
    }

    return (
      <NextLink
        {...props}
        className={[className, base(), 'group'].join(' ')}
        data-component="helpers/sitecorewrappers/linkwrapper"
        href={parsedUrl}
        onClick={handleOnClick}
        ref={ref}
        target={processTargetValue(target)}
        title={link?.title || realText}
      >
        {realText ? <span>{realText}</span> : null}
        {children}

        <ScreenReaderOnlyTextAndNewTabIcon
          target={processTargetValue(target)}
          srOnlyText={srOnlyText}
          suppressNewTabIcon={suppressNewTabIcon}
          ctaIcon={ctaIcon}
          variant={ctaVariant}
          style={style}
        />
      </NextLink>
    );
  }
);

LinkWrapper.displayName = 'LinkWrapper';

export default LinkWrapper;

function ScreenReaderOnlyTextAndNewTabIcon({
  srOnlyText,
  suppressNewTabIcon,
  target,
  ctaIcon,
  variant,
  style,
}: {
  srOnlyText?: string;
  suppressNewTabIcon?: boolean;
  target?: string;
  ctaIcon?: CtaIcons;
  variant?: string;
  style?: string;
}) {
  // Don't show new tab icon or screen reader text for custom targets
  const shouldShowNewTabIcon = target === SITECORE_TARGET_OPTIONS.NEW_BROWSER;

  if (!shouldShowNewTabIcon && !srOnlyText && !ctaIcon) {
    return <></>;
  }

  const { icon, iconNewTab } = linkWrapperTailwindVariant({
    variant,
    style,
  });

  const Icon = ctaIcon ? (
    <SvgIcon className={icon()} icon={ctaIcon} size="xs" />
  ) : !suppressNewTabIcon && shouldShowNewTabIcon ? (
    <SvgIcon className={`${icon()} ${iconNewTab()}`} icon="new-tab" size="s" />
  ) : null;

  return (
    <>
      {Icon}

      {srOnlyText ? (
        <span className="sr-only">
          {/* Preserve a single space character before SR Tab Text */}
          {`${srOnlyText ? srOnlyText : ''}${shouldShowNewTabIcon ? ' (Opens in a new tab)' : ''}`}
        </span>
      ) : null}
    </>
  );
}
