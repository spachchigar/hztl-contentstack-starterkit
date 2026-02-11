'use client';

// Global
import { JSX, useMemo, useState } from 'react';
import { tv } from 'tailwind-variants';
import Image from 'next/image';
// Lib
import { isValidNextImageDomain } from '@/lib/next-config/plugins/images';
import { IEnhancedImage } from '@/.generated';
import { cn } from '@/utils/cn';
import { getCSLPAttributes } from '@/utils/type-guards';
// Default Fallback Image
import DefaultFallbackImage from '@/public/images/default-fallback-image.webp';

/**
 * Props for the ImageWrapper component
 * 
 * @interface ImageWrapperProps
 */
export interface ImageWrapperProps {
  /** Additional CSS classes to apply to the wrapper div */
  wrapperClassName?: string;
  /** Additional CSS classes to apply to the Image component */
  imageClassName?: string;
  /** Enhanced image object from Contentstack containing image data and metadata */
  image?: IEnhancedImage;
  /** Whether the image should be loaded with priority (above the fold images) */
  priority?: boolean;
  /** Responsive image sizes attribute for optimal loading */
  sizes?: string;
  /** Image quality (1-100), defaults to 75 */
  quality?: number;
  /** Inline styles for the wrapper div */
  style?: React.CSSProperties;
  /** Whether the image should fill its parent container */
  fill?: boolean;
  /** Loading strategy: 'lazy' for below-fold, 'eager' for above-fold */
  loading?: 'lazy' | 'eager';
  /** Placeholder type: 'blur' for blur placeholder, 'empty' for no placeholder */
  placeholder?: 'blur' | 'empty';
  /** Base64 encoded image data URL for blur placeholder */
  blurDataURL?: string;
  /** Fetch priority: 'high' for high priority, 'low' for low priority, 'auto' for automatic priority */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Whether to show the fallback image */
  showFallbackImage?: boolean;
  /** Children to render inside the wrapper */
  children?: React.ReactNode;
  /** Whether the image should be full bleed */
  isFullBleed?: boolean;
}

/**
 * Internal props interface for Next.js Image component
 * 
 * @interface NextImageProps
 */
export interface NextImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image source URL */
  src: string;
  /** Alternative text for accessibility */
  alt: string;
  /** CSS classes for the image */
  className?: string;
  /** Whether image should be loaded with priority */
  priority?: boolean;
  /** Responsive image sizes attribute */
  sizes?: string;
  /** Image height in pixels */
  height?: number;
  /** Image width in pixels */
  width?: number;
  /** Inline styles for the image */
  style: React.CSSProperties;
  /** Whether image should fill its parent */
  fill?: boolean;
  /** Image quality (1-100) */
  quality?: number;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Placeholder type */
  placeholder?: 'blur' | 'empty';
  /** Blur placeholder data URL */
  blurDataURL?: string;
  /** Error callback */
  onError?: () => void;
  /** Load callback */
  onLoad?: () => void;
}

/**
 * Validates and sanitizes image dimensions
 * 
 * Ensures width and height are valid positive numbers.
 * Handles both numeric and string inputs, converting strings to numbers.
 * 
 * @param width - Image width as number or string
 * @param height - Image height as number or string
 * @returns Object with validated width and height, or null if invalid
 * 
 */
const validateDimensions = (width?: number | string, height?: number | string) => {
  if (!width || !height) return null;

  const w = typeof width === 'string' ? parseInt(width, 10) : width;
  const h = typeof height === 'string' ? parseInt(height, 10) : height;

  if (w && (isNaN(w) || w <= 0)) return null;
  if (h && (isNaN(h) || h <= 0)) return null;

  return { width: w, height: h };
};

/**
 * Generates optimal sizes attribute for responsive images
 * 
 * Creates a sizes attribute that tells the browser which image size to download
 * based on the viewport width. If custom sizes are provided, uses those.
 * Otherwise, generates optimal sizes based on image dimensions and responsive flag.
 * 
 * @param customSizes - Custom sizes attribute string (e.g., "(max-width: 768px) 100vw, 50vw")
 * @param imageWidth - Original image width in pixels
 * @param responsive - Whether the image should be responsive
 * @returns Optimized sizes attribute string
 * 
 */
const getOptimalSizes = (
  customSizes?: string,
  imageWidth?: number,
  responsive?: boolean
): string => {
  if (customSizes) return customSizes;
  if (!responsive && imageWidth) {
    return `(max-width: ${imageWidth}px) 100vw, ${imageWidth}px`;
  }
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
};

const ImageWrapper = ({
  wrapperClassName,
  imageClassName,
  image,
  quality = 75,
  priority = false,
  sizes,
  fill,
  loading,
  placeholder,
  blurDataURL,
  fetchPriority = 'auto',
  showFallbackImage = true,
  children,
  isFullBleed = false,
}: ImageWrapperProps): JSX.Element => {
  const [isError, setIsError] = useState(false);
  // Early return with null instead of empty fragment for better React performance
  if (!image || !image.image?.url) {
    return <></>;
  }

  // Extract fields from Contentstack Image
  const { title, url, dimension } = image.image;

  // Extract additional fields from Enhanced Image
  const {
    alternate_text,
    responsive_image,
    image_fit_options,
    image_position_options,
    dimensions,
    rounded_image
  } = image;

  // Validate dimensions
  const validatedDimensions = useMemo(() => {
    if (fill) return null;
    return validateDimensions(dimension?.width, dimension?.height);
  }, [dimension?.width, dimension?.height, fill]);

  // Memoize static dimensions to prevent unnecessary recalculations
  const staticDimensions = useMemo(() => {
    if (responsive_image) return null;

    const width = dimensions?.image_width || '100%';
    const height = dimensions?.image_height || 'auto';

    // Validate if dimensions are numeric strings
    const validated = validateDimensions(
      typeof width === 'string' && width !== '100%' ? width : undefined,
      typeof height === 'string' && height !== 'auto' ? height : undefined
    );

    return validated || { width, height };
  }, [dimensions?.image_width, dimensions?.image_height, responsive_image]);

  // Determine optimal sizes attribute
  const optimalSizes = useMemo(
    () => getOptimalSizes(sizes, dimension?.width, responsive_image),
    [sizes, dimension?.width, responsive_image]
  );

  // Determine loading strategy
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');

  // Build Next.js Image props
  const nextImageProps: NextImageProps = useMemo(() => {
    const props: NextImageProps = {
      alt: alternate_text || title || 'Image',
      className: imageClassName,
      priority,
      sizes: optimalSizes,
      src: isError ? DefaultFallbackImage.src : url,
      style: {
        width: '100%',
        height: '100%',
      },
      quality: Math.max(1, Math.min(100, quality)), // Clamp quality between 1-100
      loading: loadingStrategy,
      fetchPriority,
    };

    if (placeholder === 'blur' && blurDataURL) {
      props.placeholder = 'blur';
      props.blurDataURL = blurDataURL;
    } else if (placeholder) {
      props.placeholder = placeholder;
    }

    if (fill) {
      props.fill = true;
    } else if (validatedDimensions) {
      props.height = validatedDimensions.height;
      props.width = validatedDimensions.width;
    }

    if (image_fit_options) {
      props.style.objectFit = image_fit_options;
    }

    if (image_position_options) {
      props.style.objectPosition = image_position_options;
    }

    return props;
  }, [
    alternate_text,
    title,
    imageClassName,
    priority,
    optimalSizes,
    url,
    quality,
    loadingStrategy,
    placeholder,
    blurDataURL,
    fill,
    validatedDimensions,
    image_fit_options,
    image_position_options,
    fetchPriority,
  ]);

  const isValidDomain = useMemo(() => isValidNextImageDomain(url), [url]);

  const { wrapperBase, fallbackImageBase } = TAILWIND_VARIANTS({
    isFill: !!fill,
    roundedImage: !!rounded_image,
    isFullBleed: !!isFullBleed
  });

  const wrapperStyle = useMemo(() => {
    if (responsive_image || !staticDimensions) return undefined;
    return {
      width: staticDimensions.width,
      height: staticDimensions.height,
    };
  }, [responsive_image, staticDimensions]);

  return (
    <div
      className={cn(wrapperBase(), wrapperClassName)}
      style={wrapperStyle}
    >
      {!isError && <Image
        data-component="helpers/fieldwrappers/imagewrapper"
        {...nextImageProps}
        unoptimized={!isValidDomain}
        className={cn(imageClassName)}
        onError={() => setIsError(true)}
        {...getCSLPAttributes(image.$?.image)}
      />}

      {isError && showFallbackImage && (
        <Image
          src={DefaultFallbackImage}
          alt="Default Fallback Image"
          className={fallbackImageBase()}
          unoptimized={true}
        />
      )}
      {children}
    </div>
  );
};

export default ImageWrapper;

const TAILWIND_VARIANTS = tv({
  slots: {
    wrapperBase: ['w-full', 'h-full'],
    fallbackImageBase: ['w-full', 'h-full']
  },
  variants: {
    isFill: {
      true: {
        wrapperBase: ['relative'],
      },
    },
    roundedImage: {
      true: {
        wrapperBase: ['rounded-lg', 'overflow-hidden'],
      }
    },
    isFullBleed: {
      true: {
        wrapperBase: [
          'w-screen',
          'left-[calc(-50vw+50%)]',
          'right-[calc(-50vw+50%)]',
          'relative'
        ]
      }
    }
  },
});
