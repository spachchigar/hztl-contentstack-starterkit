'use client';

// Global
import React, { useEffect } from 'react';

// Local
import { HeaderDesktop } from '@/components/authorable/site-structure/Header/HeaderDesktop';
import HeaderMobile from '@/components/authorable/site-structure/Header/HeaderMobile';
import { tv } from 'tailwind-variants';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { HeaderProvider, useHeader } from './HeaderContext';
import { getTestProps } from '@/lib/testing/utils';
import { IHeader } from '@/.generated';

const HeaderContent = (props: IHeader) => {
  const { isOverlayVisible, handleOverlayChange, setIsMobile } = useHeader();
  const isMobile = useIsMobile();

  // Update isMobile state when device type changes
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  // Update overlay visibility whenever any menu state changes
  useEffect(() => {
    handleOverlayChange();
  }, [handleOverlayChange]);

  const { base, overlay } = TAILWIND_VARIANTS({
    isOverlayVisible,
  });

  /*
   * Rendering
   */

  if (!props) {
    return <></>;
  }

  return (
    <>
      <header
        id="header"
        data-component="authorable/shared/site-structure/header/header"
        {...getTestProps(`component-header-` + props?.uid)}
        className={base()}
      >
        <div className="hidden md:block">
          <HeaderDesktop {...props} />
        </div>
        <div className="block md:hidden">
          {/* <HeaderMobile {...props} /> */}
        </div>
      </header>
      {isOverlayVisible && <div className={overlay()} />}
    </>
  );
};

export const Header = (props: IHeader) => {
  return (
    <HeaderProvider>
      <HeaderContent {...props} />
    </HeaderProvider>
  );
};

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'relative',
      'top-0',
      'bg-component-header-nav-bg',
      'w-full',
      'z-40',
      'transition-transform',
      'duration-300',
    ],
    overlay: ['fixed', 'inset-0', 'bg-black', 'opacity-50', 'z-30'],
  },
  variants: {
    isOverlayVisible: {
      true: {
        overlay: ['block'],
      },
      false: {
        overlay: ['hidden'],
      },
    },
  },
});
