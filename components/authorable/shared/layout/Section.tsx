import { IComponents } from "@/.generated";
import { ButtonWrapper } from "@/helpers/Wrappers/ButtonWrapper/ButtonWrapper";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";
import { tv } from "tailwind-variants";

export const Section = (props: IComponents['section']) => {

  const shouldShowCTAs = props.test_cta && props.test_cta.length > 0;

  const { base, wrapper, container, content, title, description, imageWrapper, cta, ctaGroupWrapper } = TAILWIND_VARIANTS();
  return (
    <div className={base()}>
      <div className={wrapper()}>
        <div className={container()}>
          <ImageWrapper image={props.test_image} wrapperClassName={imageWrapper()} />
          <div className={content()}>
            <h2 className={title()} {...getCSLPAttributes(props.$?.title)}>
              {props.title}
            </h2>
            <p className={description()} {...getCSLPAttributes(props.$?.description)}>
              {props.description}
            </p>
            {shouldShowCTAs && (
              <div className={ctaGroupWrapper()}>
                {props.test_cta?.map((ctaItem, index) => {
                  return (
                    <div className={cta()} key={`${ctaItem.link?.title}-${index}`}>
                      <ButtonWrapper cta={ctaItem} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'w-full',
    ],
    wrapper: [
      'flex',
      'flex-col',
      'justify-center',
      'my-10'
    ],
    container: [
      'w-full',
      'max-w-screen-2xl',
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-5',
      'bg-cyan-300',
      'px-6',
      'md:px-12',
      'lg:px-20',
      'py-10'
    ],
    imageWrapper: [
      'w-full',
    ],
    content: [
      'flex',
      'flex-col',
      'gap-3',
      'justify-center',
    ],
    title: [
      'text-4xl',
      'font-bold',
    ],
    description: [
      'text-lg',
      'text-gray-600',
    ],
    cta: [
      'w-full',
      'md:w-fit'
    ],
    ctaGroupWrapper: [
      'flex',
      'flex-col',
      'md:flex-row',
      'flex-wrap',
      'justify-start',
      'gap-4'
    ]
  }
})