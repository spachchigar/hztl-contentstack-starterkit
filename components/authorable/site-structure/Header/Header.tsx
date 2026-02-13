'use client';

import { CSLPAttribute, CSLPFieldMapping, IEnhancedImage, IHeader, ILink } from "@/.generated";
import { useIsScrolled } from "@/lib/hooks/useIsScrolled";
import { tv } from "tailwind-variants";
import { LanguageSelector } from './LanguageSelector';
import Link from "next/link";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";

export const Logo = ({
  logo,
  logoLink,
  $
}: {
  logo?: IEnhancedImage;
  logoLink?: ILink;
  $?: CSLPFieldMapping
}) => {
  const { logoContainer } = TAILWIND_VARIANTS();

  if (!logo || !logoLink) return null;

  return (
    <div className={logoContainer()} {...getCSLPAttributes($)}>
      <Link
        href={logoLink?.href ?? '/'}
      >
        <ImageWrapper
          image={logo}
        />
      </Link>
    </div>
  );
};

export const Header = (props: IHeader) => {
  const isScrolled = useIsScrolled();

  const { base, wrapper, inner, menuWrapper, menuContainer, languageWrapper } = TAILWIND_VARIANTS({ isScrolled: isScrolled });

  return (<header className={base()} id="header">
    <div className={wrapper()}>
      <div className={inner()}>
        <div className={menuWrapper()}>
          <div className={menuContainer()}>
            <Logo logo={props.logo} logoLink={props.logo_link} $={props.$?.logo_link} />
          </div>
          <div className={languageWrapper()}>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  </header>);
};

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'sticky',
      'top-0',
      'z-40',
      'w-full',
      'transition-transform',
      'duration-300',
      'bg-white',
    ],
    wrapper: [
      'flex',
      'justify-center',
      'transition-all',
      'duration-200',
      'w-full',
    ],
    inner: [
      'w-full',
      'max-w-screen-2xl',
      'px-6',
      'md:px-12',
      'lg:px-20'
    ],
    menuWrapper: [
      'flex',
      'justify-between'
    ],
    menuContainer: [
      'flex',
    ],
    languageWrapper: [
      'flex',
      'w-[38%]',
      'lg:w-auto',
      'items-center',
      'justify-end',
    ],
    logoContainer: [
      'flex',
      'items-center'
    ]
  },
  variants: {
    isScrolled: {
      false: {
        wrapper: ['py-6']
      },
      true: {
        wrapper: ['py-3']
      }
    }
  }
})
