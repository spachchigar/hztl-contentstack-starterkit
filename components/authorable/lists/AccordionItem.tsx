'use client';

// Global
import React, { useRef, JSX, useCallback } from 'react';
import { tv } from 'tailwind-variants';

// Local
import RichTextWrapper from '@/helpers/Wrappers/RichTextWrapper/RichTextWrapper';
import { withStandardComponentWrapper } from '@/helpers/HOC';
import { SvgIcon } from '@/helpers/SvgIcon';
import { useScrollElementIntoView } from '@/lib/hooks/useScrollElementIntoView';
import { useAccordionItemContext } from '@/helpers/Context/AccordionContext';
import { getTestProps } from '@/lib/testing/utils';
import { IAccordionItem } from '@/.generated';

export const AccordionItem = withStandardComponentWrapper((props: IAccordionItem): JSX.Element => {
  const { content, title } = props || {};
  const accordionId = `accordion-${props.uid}`;
  /*
   * REFS
   */

  const accordionItemButtonRef = useRef<HTMLButtonElement>(null);

  const accordionItemBodyRef = useRef<HTMLDivElement>(null);

  /*
   * State
   */

  const { isOpening, toggleOpen, isVisible, scrollToOpenPanel } = useAccordionItemContext(
    props.uid ?? '',
    accordionItemBodyRef
  );

  /*
   * Convenience Methods
   */

  const toggleAccordion = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  /*
   * Lifecycle
   */

  const scrollCondition = scrollToOpenPanel && isOpening;

  useScrollElementIntoView(accordionItemButtonRef.current, {
    stickyHeaderId: 'header',
    condition: scrollCondition,
    animationElement: accordionItemBodyRef.current,
    scrollTargetId: accordionId,
  });

  /*
   * Rendering
   */

  const {
    base,
    buttonWrapper,
    iconWrapper,
    contentContainer,
    contentContainerInner,
    richTextWrapper,
    headingText,
  } = TAILWIND_VARIANTS({
    isOpening,
    isVisible,
  });

  return (
    <div
      className={base()}
      data-component="authorable/shared/lists/accordionitem"
      key={accordionId}
      {...getTestProps(`accordion-item-${accordionId}`)}
    >
      <div className="flex flex-col gap">
        <button
          aria-expanded={isOpening}
          className={buttonWrapper()}
          onClick={toggleAccordion}
          ref={accordionItemButtonRef}
          type="button"
          {...getTestProps(`toggle-button`)}
        >
          <h3 className={headingText()} {...getTestProps(`heading`)}>
            {title}
          </h3>
          <span className={iconWrapper()} {...getTestProps(`icon`)}>

            <SvgIcon fill="none" icon="chevron-down" size="xs" viewBox="0 0 24 24" />
          </span>
        </button>
        <div
          aria-labelledby={accordionId}
          className={contentContainer()}
          role="region"
          ref={accordionItemBodyRef}
          tabIndex={isOpening ? undefined : -1}
          aria-hidden={!isOpening}
        >
          <div className={contentContainerInner()}>
            <RichTextWrapper
              aria-required={isOpening}
              className={richTextWrapper()}
              content={content}
              tabIndex={-1}
              {...getTestProps(`content`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    isOpen: false,
    isVisible: true,
  },
  slots: {
    base: [
      'border',
      'border-component-accordion-item-border',
      'hover:border-component-accordion-item-border-hover',
      'overflow-hidden',
    ],
    buttonWrapper: [
      'cursor-pointer',
      'duration-300',
      'flex',
      'items-center',
      'justify-between',
      'px-component-accordion-item-padding-x',
      'py-component-accordion-item-padding-y',
      'transition-none',
      'w-full',
      'scroll-mt-[123px]',
      'hover:underline',
      'focus:ring-2',
      'focus:ring-offset',
      'focus:ring-inset',
      'focus:ring-color-border-border-focus',
      'bg-component-accordion-item-surface-active',
    ],
    contentContainer: [
      'duration-300',
      'ease-in-out',
      'grid',
      'overflow-hidden',
      'transition-all',
      'bg-component-accordion-item-surface-active',
    ],
    contentContainerInner: ['overflow-hidden'],
    iconWrapper: ['transform', 'transition-transform', 'mx-spacing-spacing-4'],
    richTextWrapper: [
      'text-left',
      'font-normal',
      'mb-0',
      'px-component-accordion-item-padding-x',
      'pb-component-accordion-item-padding-y',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'font-normal',
      'leading-normal',
    ],
    headingText: [
      'text-color-text-text',
      'font-typography-body-font-family',
      'text-typography-body-large-font-size',
      'font-bold',
      'text-left',
      'leading-typography-line-height-body-large',
    ],
  },
  variants: {
    isOpening: {
      false: {
        base: ['rounded-component-accordion-item-border-radius'],
        buttonWrapper: ['rounded-component-accordion-item-border-radius'],
        contentContainer: [
          'grid-rows-[0fr]',
          'opacity-0',
          'pointer-events-none',
          'select-none',
          'invisible',
        ],
        iconWrapper: [],
      },
      true: {
        base: [
          'rounded-component-accordion-item-border-radius',
          'border-component-accordion-item-border-active',
        ],
        buttonWrapper: ['rounded-t-component-accordion-item-border-radius'],
        contentContainer: ['grid-rows-[1fr]', 'opacity-100', 'visible'],
        iconWrapper: ['rotate-180'],
      },
    },

    isVisible: {
      false: ['max-sm:hidden'],
      true: [],
    },
  },
});
