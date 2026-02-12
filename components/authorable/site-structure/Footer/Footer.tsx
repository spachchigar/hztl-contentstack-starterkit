import { IFooter } from "@/.generated";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";
import { tv } from "tailwind-variants";

export const Footer = (props: IFooter) => {
  const currentYear = new Date().getFullYear();
  const { base, container, content, logoWrapper, copyright } = TAILWIND_VARIANTS();

  return (
    <footer className={base()}>
      <div className={container()}>
        <div className={content()}>
          {/* Logo */}
          {props.logo && (
            <div className={logoWrapper()}>
              <ImageWrapper image={props.logo} />
            </div>
          )}

          {/* Copyright */}
          <p className={copyright()} {...getCSLPAttributes(props.$?.copyright_text)}>
            {props.copyright_text || `© ${currentYear} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      "w-full",
      "bg-slate-200",
      "mt-auto",
    ],
    container: [
      "max-w-screen-2xl",
      "mx-auto",
      "px-6",
      "md:px-12",
      "xl:px-20",
      "py-8",
    ],
    content: [
      "flex",
      "flex-col",
      "gap-4",
      "items-center",
    ],
    logoWrapper: [
      "flex",
      "justify-center",
      "items-center",
    ],
    copyright: [
      "text-gray-600",
      "text-sm",
      "text-center",
    ],
  },
});