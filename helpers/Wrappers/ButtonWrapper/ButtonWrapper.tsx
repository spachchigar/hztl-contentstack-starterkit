'use client';

import { IEnhancedCta } from "@/.generated"
import { cn } from "@/utils/cn";
import { getCSLPAttributes } from "@/utils/type-guards";
import Link from "next/link";
import { JSX, useCallback, useMemo } from "react";
import { tv } from "tailwind-variants";

/**
 * Props for the ButtonWrapper component
 * 
 * @interface ButtonWrapperProps
 */
export interface ButtonWrapperProps extends React.HTMLAttributes<HTMLButtonElement> {
    /** Enhanced CTA object from Contentstack */
    cta?: IEnhancedCta;
    /** Direct href URL (alternative to CTA object) */
    href?: string;
    /** Button text/label */
    customLabel?: string;
    /** Whether button is disabled */
    disabled?: boolean;
    /** Whether button should have a focus ring */
    focusRing?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Click handler (for button mode) */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Button type (for button mode) */
    type?: 'button' | 'submit' | 'reset';
    /** ARIA label for accessibility */
    ariaLabel?: string;
}

export const ButtonWrapper = ({
    cta,
    href,
    customLabel,
    disabled = false,
    focusRing = true,
    className,
    onClick,
    type = 'button',
    ariaLabel
}: ButtonWrapperProps): JSX.Element => {
    //Early return if no CTA or href
    if (!cta && !href) return <></>;

    // Define default values
    const defaultVariant = 'primary';
    const defaultSize = 'md';

    //Get additional fields from Enhanced CTA
    const opensInNewTab = cta?.opens_in_new_tab || false;
    const ctaVariant = cta?.cta_variant || defaultVariant;
    const ctaSize = cta?.cta_size || defaultSize;

    //Determine if this is a link or button
    const isLink = !!href || !!cta?.link?.href;
    const linkHref = cta?.link?.href || href || '#';
    const linkTitle = cta?.link?.title || customLabel || '';

    //Determine if link is external
    const isExternal = useMemo(() => {
        if (!isLink) return false;
        return linkHref.startsWith('http') || linkHref.startsWith('https') || linkHref.startsWith('//');
    }, [isLink, linkHref])

    //Determine if should open in new tab
    const shouldOpenInNewTab = opensInNewTab || isExternal;

    //Memoize click handler
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
            if (disabled) {
                e.preventDefault();
                return;
            }
            onClick?.(e as React.MouseEvent<HTMLButtonElement>)
        },
        [disabled, onClick]
    )

    const base = TAILWIND_VARIANTS({
        variant: ctaVariant,
        size: ctaSize,
        disabled,
        focusRing,
    })

    // Common props for both button and link
    const commonProps = {
        className: cn(base, className),
        'data-component': 'helpers/fieldwrappers/buttonwrapper',
        'aria-label': ariaLabel || (shouldOpenInNewTab ? `${linkTitle} (Opens in a new tab)` : undefined),
        ...getCSLPAttributes(cta?.$?.link),
    };

    // Render as Link
    if (isLink) {
        return (
            <Link
                href={linkHref}
                target={shouldOpenInNewTab ? '_blank' : undefined}
                rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                onClick={handleClick}
                {...commonProps}
            >
                {linkTitle}
            </Link>
        )
    }

    // Render as Button
    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            {...commonProps}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
        >
            {linkTitle}
        </button>
    )
}

const TAILWIND_VARIANTS = tv({
    base: [
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'font-medium',
        'transition-all',
        'duration-300',
        'focus:outline-none',
        'w-full'
    ],
    variants: {
        variant: {
            primary: [
                'bg-blue-600',
                'text-white',
                'hover:bg-blue-700',
                'active:bg-blue-800',
            ],
            secondary: [
                'bg-gray-600',
                'text-white',
                'hover:bg-gray-700',
                'active:bg-gray-800',
            ],
            outline: [
                'border-2',
                'border-blue-600',
                'text-blue-600',
                'bg-transparent',
                'hover:bg-blue-50',
                'active:bg-blue-100',
            ],
            ghost: [
                'text-blue-600',
                'bg-transparent',
                'hover:bg-blue-50',
                'active:bg-blue-100',
            ],
            danger: [
                'bg-red-600',
                'text-white',
                'hover:bg-red-700',
                'active:bg-red-800',
            ],
            link: [
                'text-blue-600',
                'underline',
                'bg-transparent',
                'hover:text-blue-700',
                'p-0',
                'h-auto',
            ],
        },
        size: {
            sm: ['text-sm', 'px-3', 'py-1.5', 'h-8'],
            md: ['text-base', 'px-4', 'py-2', 'h-10'],
            lg: ['text-lg', 'px-6', 'py-3', 'h-12'],
            xl: ['text-xl', 'px-8', 'py-4', 'h-14'],
        },
        disabled: {
            true: [
                'cursor-not-allowed',
                'opacity-50',
                'pointer-events-none',
            ],
        },
        focusRing: {
            true: ['focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2']
        },
    }
})