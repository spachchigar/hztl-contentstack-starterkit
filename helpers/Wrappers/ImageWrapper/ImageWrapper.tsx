// SEE: https://nextjs.org/docs/app/api-reference/components/image
// SEE: https://refine.dev/blog/using-next-image/#src

// Global
import NextImage, { ImageProps } from 'next/image';
import { JSX } from 'react';
// Lib
import { isValidNextImageDomain } from '@/lib/next-config/plugins/images';
import { IEnhancedImage, IFile } from '@/.generated';

/**
 * JSS does not yet support Next Image in Experience Editor
 * This component will switch between the two based on environment
 * which allows us to get the various performance benefits from Next Image.
 *
 * NOTE: Images may display slightly differently in
 * Experience Editor as the JSS Image component doesn't have the same layout options.
 */

// interface SizedImageFieldProps extends ImageField {
//   value?: {
//     alt?: string;
//     height: number | `${number}`;
//     src?: string;
//     width: number | `${number}`;
//   };
// }

export interface ImageWrapperProps {
  className?: string;
  enhancedImage?: IEnhancedImage | null;
  layout?: NextImageLayoutOption;
  priority?: boolean;
  sizes?: string;
}

type NextImageLayoutOption = 'fill' | 'intrinsic' | 'responsive';

const ImageWrapper = ({
  className,
  enhancedImage,
  layout = 'intrinsic',
  priority,
  sizes = '100vw',
}: ImageWrapperProps): JSX.Element => {

  //If no image, don't render anything.
  if (!enhancedImage || !enhancedImage.image?.url) {
    return <></>;
  }

  const { url, title } = enhancedImage.image;

  const nextImageProps: ImageProps = {
    alt: (title as string) || '',
    className: className,
    priority,
    sizes,
    src: url
  };

  // Remove layout and update with new usage based on NextImage in Next 13+
  if (layout === 'responsive') {
    nextImageProps.sizes = '100vw';
    nextImageProps.style = {
      width: '100%',
      height: 'auto',
    };
  }

  if (layout === 'fill') {
    nextImageProps.fill = true;
  } else {
    nextImageProps.height = enhancedImage.image_height ?? undefined;
    nextImageProps.width = enhancedImage.image_width ?? undefined;
  }

  const isValidDomain = isValidNextImageDomain(url);

  return (
    <NextImage
      data-component="helpers/fieldwrappers/imagewrapper"
      {...nextImageProps}
      unoptimized={!isValidDomain}
    />
  );
};

export default ImageWrapper;
