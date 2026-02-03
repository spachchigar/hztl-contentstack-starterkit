'use client';

import { IEnhancedImage, IEnhancedLink, IHeader, ILink } from "@/.generated";
import { useIsScrolled } from "@/lib/hooks/useIsScrolled";
import { tv } from "tailwind-variants";
import LanguageSelector from "../primitives/LanguageSelector";
import Link from "next/link";
import Image from "next/image";
import { getCSLPAttributes } from "@/utils/type-guards";

export const Logo = ({
  logo,
  logoLink,
}: {
  logo?: IEnhancedImage;
  logoLink?: IEnhancedLink;
}) => {
  const { logoContainer } = TAILWIND_VARIANTS();

  if (!logo || !logoLink) return null;

  return (
    <div className={logoContainer()}>
      <Link
        href={logoLink?.link?.href ?? '/'}
        {...getCSLPAttributes(logoLink.$?.link)}
      >
        <Image src={logo.image?.url ?? ''} width={logo.image_width ?? 0} height={logo.image_height ?? 0} priority alt={logo.image?.title ?? ''} {...getCSLPAttributes(logo.$?.image)} />
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
        <div className={menuWrapper()} role="menubar">
          <div className={menuContainer()}>
            <Logo logo={props.logo} logoLink={props.logo_link} />
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
      'bg-white',
      'transition-transform',
      'duration-300',
    ],
    wrapper: [
      'flex',
      'justify-center',
      'transition-all',
      'duration-200',
    ],
    inner: [
      'w-full',
      'max-w-screen-2xl',
      'px-20'
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
