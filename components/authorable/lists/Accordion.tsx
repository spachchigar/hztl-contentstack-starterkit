'use client';

// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
// Local
import { withStandardComponentWrapper } from '@/helpers/HOC';
import { AccordionContextProvider, useAccordionContext } from '@/helpers/Context/AccordionContext';
import { getTestProps } from '@/lib/testing/utils';
import { IAccordion, IAccordionItem } from '@/.generated';
import { useGlobalLabels } from '@/providers/GlobalLabelsProvider';
import { ReferencePlaceholder } from '@/components/primitives/ReferencePlaceholder';

// Expand/Collapse All Buttons Component
const AccordionControls = () => {
  const { openPanels, panels, expandAll, collapseAll } = useAccordionContext();
  const { globalLabels } = useGlobalLabels();

  const allPanelIds = panels.map((panel) => panel.uid ?? '').filter(Boolean);
  const allOpen =
    allPanelIds.length > 0 &&
    allPanelIds.every((id: string) => openPanels.some((panel) => panel.uid === id));
  const someOpen = openPanels.length > 0;

  const {
    expandCollapseBtn,
    expandCollapseBtnActive,
    expandCollapseBtnInactive,
    divider,
    controlsContainer,
  } = TAILWIND_VARIANTS();

  return (
    <div className={controlsContainer()}>
      <button
        type="button"
        onClick={expandAll}
        disabled={allOpen}
        className={
          expandCollapseBtn() +
          ' ' +
          (allOpen ? expandCollapseBtnInactive() : expandCollapseBtnActive())
        }
        aria-label="Expand all accordion items"
      >
        {globalLabels.accordion_expand_all_label || 'Expand All'}
      </button>
      <span className={divider()} />
      <button
        type="button"
        onClick={collapseAll}
        disabled={!someOpen}
        className={
          expandCollapseBtn() +
          ' ' +
          (!someOpen ? expandCollapseBtnInactive() : expandCollapseBtnActive())
        }
        aria-label="Collapse all accordion items"
      >
        {globalLabels.accordion_collapse_all_label || 'Collapse All'}
      </button>
    </div>
  );
};

export const Accordion = withStandardComponentWrapper((props: IAccordion): JSX.Element => {

  /*
   * Rendering
   */

  const { base, container, controls } = TAILWIND_VARIANTS();

  const accordionItems = props.accordion_items ?? [];

  const singlePanelOpen = props.component_params?.single_open_panel === true;

  const scrollToOpenPanel = props.component_params?.scroll_to_open_panel === true;

  const defaultOpenPanels: IAccordionItem[] = [];

  if (props.component_params?.open_by_default === true) {
    if (singlePanelOpen) {
      defaultOpenPanels.push(accordionItems?.[0] ?? ({} as IAccordionItem));
    } else {
      defaultOpenPanels.push(...(accordionItems ?? []));
    }
  }

  return (
    <section
      className={base()}
      data-component="authorable/shared/lists/accordion"
      id={props?.uid}
      {...getTestProps(`component-accordion-${props?.uid}`)}
    >
      <AccordionContextProvider
        panels={accordionItems ?? []}
        singleOpenPanel={singlePanelOpen}
        scrollToOpenPanel={scrollToOpenPanel}
        defaultOpenPanels={defaultOpenPanels ?? []}
      >
        <div className={container()}>
          <div className={controls()}>{!singlePanelOpen && <AccordionControls />}</div>
          <ReferencePlaceholder references={accordionItems}></ReferencePlaceholder>
        </div>
      </AccordionContextProvider>
    </section>
  );
});

const TAILWIND_VARIANTS = tv({
  slots: {
    base: ['border-solid'],
    container: ['flex', 'flex-col', 'gap-spacing-spacing-8', 'relative'],
    controls: ['relative', 'flex', 'justify-end', 'z-10'],
    expandCollapseBtn: [
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'leading-typography-line-height-body-medium',
      'px-2',
      'py-0',
      'border-none',
      'outline-none',
      'focus:underline',
      'transition-colors',
      'cursor-pointer',
      'hover:underline',
      'focus:ring',
      'focus:ring-offset-1',
      'focus:ring-color-border-border-focus',
      'rounded-component-accordion-item-border-radius',
    ],
    expandCollapseBtnActive: ['text-component-accordion-toggle-active', 'font-bold'],
    expandCollapseBtnInactive: [
      'text-component-accordion-toggle',
      'font-normal',
      'disabled:cursor-not-allowed',
    ],
    divider: [
      'border-l',
      'border-component-accordion-divider',
      'mx-2',
      'h-5',
      'inline-block',
      'align-middle',
    ],
    controlsContainer: ['flex', 'items-center', 'gap-0'],
  },
});
