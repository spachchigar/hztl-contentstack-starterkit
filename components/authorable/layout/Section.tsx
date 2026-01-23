'use client';

// Global
import React, { JSX } from 'react';
// Local
import { withStandardComponentWrapper } from '@/helpers/HOC';
import { tv } from 'tailwind-variants';
import { BrandAndThemeProvider } from '@/providers/BrandAndThemeContext';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { TextAlignmentProvider } from '@/lib/context/TextAlignmentContext';
import { IComponents, ITheme } from '@/.generated';
import { ReferencePlaceholder } from '@/components/primitives/ReferencePlaceholder';

export const Section = withStandardComponentWrapper(
  (props: IComponents['section']): JSX.Element => {
    const { title, description, section_items, styling_options } = props;

    const theme = styling_options?.select_theme?.theme_options;
    const textAlignment = styling_options?.select_alignment?.alignment_options || 'Left';
    const hasContent = Boolean(title || description);
    const noPaddingTop = Boolean(styling_options?.remove_padding_top);
    const noPaddingBottom = Boolean(styling_options?.remove_padding_bottom);
    const noPaddingSides = Boolean(styling_options?.remove_padding_left_right);
    const isCentered75 = Boolean(styling_options?.display_center_75);

    const { base, sectionTitle, sectionDescription, sectionContentWrapper, sectionHeaderWrapper } =
      TAILWIND_VARIANTS({
        textAlignment,
      });

    /*
     * RENDERING
     */

    console.log(theme);

    return (
      <div data-component="authorable/shared/layout/section">
        <BrandAndThemeProvider theme={theme as NonNullable<ITheme['theme_options']>}>
          <TextAlignmentProvider textAlignment={textAlignment}>
            <div
              className={base({
                textAlignment,
                removePaddingTop: noPaddingTop,
                removePaddingBottom: noPaddingBottom,
                removePaddingLeftRight: noPaddingSides,
              })}
            >
              <div
                className={sectionContentWrapper({
                  hasContent,
                  displayCenter75: isCentered75,
                })}
              >
                <div className={sectionHeaderWrapper()}>
                  <PlainTextWrapper className={sectionTitle()} content={title} tag="h2" />
                  <span className={sectionDescription()}>
                    <PlainTextWrapper content={description} />
                  </span>
                </div>
                <ReferencePlaceholder references={section_items ?? []} />
              </div>
            </div>
          </TextAlignmentProvider>
        </BrandAndThemeProvider>
      </div>
    );
  }
);

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'flex',
      'bg-component-section-bg',
      'gap-component-section-container-gutter',
      'rounded-general-border-radius-wrapper-container',
      'flex-wrap',
    ],
    sectionTitle: [
      'text-component-section-title',
      'font-typography-header-font-family',
      'text-typography-header-large-font-size',
      'font-bold',
      'leading-tight',
    ],
    sectionDescription: [
      'text-component-section-body',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'leading-normal',
    ],
    sectionContentWrapper: ['flex', 'flex-col', 'w-full', 'h-auto'],
    sectionHeaderWrapper: [
      'flex',
      'flex-col',
      'gap-general-spacing-title-margin-bottom',
      'max-w-columns-two-third-max-width',
    ],
  },
  variants: {
    textAlignment: {
      Left: {
        base: 'text-left',
      },
      Center: {
        base: 'text-center',
        sectionHeaderWrapper: 'mx-auto',
      },
      Right: {
        base: 'text-right',
      },
    },
    hasContent: {
      true: {
        sectionContentWrapper: 'gap-space-between-more',
      },
      false: {
        sectionContentWrapper: 'gap-0',
      },
    },
    removePaddingTop: {
      true: {
        base: ['pt-0'],
      },
      false: {
        base: ['pt-component-section-container-padding-y'],
      },
    },
    removePaddingBottom: {
      true: {
        base: ['pb-0'],
      },
      false: {
        base: ['pb-component-section-container-padding-y'],
      },
    },
    removePaddingLeftRight: {
      true: {
        base: [],
      },
      false: {
        base: ['px-component-section-container-padding-x'],
      },
    },
    displayCenter75: {
      true: {
        sectionContentWrapper: ['max-w-layout-container-center70-max-width', 'mx-auto'],
      },
      false: {
        sectionContentWrapper: [],
      },
    },
  },
  defaultVariants: {
    textAlignment: 'Left',
    hasContent: false,
    removePaddingTop: false,
    removePaddingBottom: false,
    removePaddingLeftRight: false,
    displayCenter75: false,
  },
});
