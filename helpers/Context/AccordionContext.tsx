'use client';
import { IAccordionItem } from '@/.generated';
import { useAnimatingToggleState } from '@/lib/hooks/ui-hooks/useAnimatingToggleState';

//Commented for now for contentstack
// import useIsEditing from 'lib/hooks/useIsEditing';
// import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const AccordionContext = createContext<AccordionContextProps>({
  openPanels: [],
  panels: [],
  togglePanel: () => {
    /** Placeholder for real function */
  },
  /** Placeholder for real function */
  scrollToOpenPanel: false,
  panelIsOpen: () => false,
  expandAll: () => {
    /** Placeholder for real function */
  },
  collapseAll: () => {
    /** Placeholder for real function */
  },
});

export function useAccordionContext() {
  return useContext(AccordionContext);
}

export function useAccordionItemContext(
  uid: string,
  animatingBodyRef?: RefObject<HTMLElement | null>
) {
  const { panelIsOpen, togglePanel, scrollToOpenPanel } = useAccordionContext();

  // Whether the panel should be open
  const isOpen = panelIsOpen(uid ?? '');

  /*
   * REFS
   */
  // Placeholder ref just so we don't have a null ref
  const accordionItemBodyRef = useRef<HTMLDivElement>(null);

  /*
   * State
   */

  const [isOpening, setIsOpening, isVisible] = useAnimatingToggleState(
    animatingBodyRef ?? accordionItemBodyRef,
    isOpen
  );

  const toggleOpen = useCallback((open?: boolean) => togglePanel(uid, open), [togglePanel, uid]);

  useEffect(() => {
    setIsOpening(isOpen);
  }, [isOpen]);

  return {
    isOpening,
    toggleOpen,
    isVisible,
    scrollToOpenPanel,
  };
}

export function AccordionContextProvider({
  children,
  panels,
  singleOpenPanel,
  scrollToOpenPanel,
  defaultOpenPanels = [],
}: AccordionContextProviderProps) {
  const [openPanelIds, setOpenPanelIds] = useState<string[]>(
    defaultOpenPanels.map((x) => x.uid ?? '')
  );

  //Commented for now for contentstack
  // const isEditing = useIsEditing();

  const togglePanel = useCallback(
    (uid: string, open?: boolean) => {
      setOpenPanelIds((openIds) => {
        const currentlyOpen = openIds.includes(uid);
        const shouldOpen = open ?? !currentlyOpen;

        if (shouldOpen && !currentlyOpen) {
          return singleOpenPanel ? [uid] : [...openIds, uid];
        } else if (!shouldOpen && currentlyOpen) {
          return singleOpenPanel ? [] : openIds.filter((x) => x != uid);
        }
        // No change, return the original array, don't create a new one.
        return openIds;
      });
    },
    [singleOpenPanel]
  );

  const panelIsOpen = useCallback((uid: string) => openPanelIds.includes(uid), [openPanelIds]);

  const expandAll = useCallback(() => {
    const allPanelIds = panels.map((panel) => panel.uid ?? '').filter(Boolean);
    // Open items in reverse order with delay to prevent scroll conflicts
    allPanelIds.reverse().forEach((id: string, index: number) => {
      setTimeout(() => {
        togglePanel(id, true);
      }, index * 100);
    });
  }, [panels, togglePanel]);

  const collapseAll = useCallback(() => {
    const allPanelIds = panels.map((panel) => panel.uid ?? '').filter(Boolean);
    // Close items in reverse order with delay
    allPanelIds.reverse().forEach((id: string, index: number) => {
      setTimeout(() => {
        togglePanel(id, false);
      }, index * 100);
    });
  }, [panels, togglePanel]);

  return (
    <AccordionContext.Provider
      value={{
        openPanels: openPanelIds
          .map((uid) => panels.find((p) => p.uid === uid) as IAccordionItem)
          .filter((x) => x !== undefined),
        panels,
        togglePanel,
        panelIsOpen,
        scrollToOpenPanel: !!scrollToOpenPanel,
        expandAll,
        collapseAll,
      }}
    >
      {children}
    </AccordionContext.Provider>
  );
}

interface AccordionContextProviderProps extends React.PropsWithChildren {
  panels: IAccordionItem[];
  singleOpenPanel: boolean;
  scrollToOpenPanel?: boolean;
  defaultOpenPanels: IAccordionItem[];
}

export interface AccordionContextProps {
  openPanels: IAccordionItem[];
  panels: IAccordionItem[];
  scrollToOpenPanel: boolean;
  togglePanel: (uid: string, open?: boolean) => void;
  panelIsOpen: (uid: string) => boolean;
  expandAll: () => void;
  collapseAll: () => void;
}
