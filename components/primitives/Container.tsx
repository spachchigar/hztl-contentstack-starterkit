import { cn } from '@/utils/cn';
import React, { CSSProperties, PropsWithChildren } from 'react';

interface ContainerProps {
  componentName?: string;
  className?: string;
  fullScreen?: boolean;
  edgeToEdge?: boolean;
  content?: boolean;
  topPadded?: boolean;
  bottomPadded?: boolean;
  maxWidthOverride?: string;
  tag?: 'section' | 'div' | 'header' | 'footer';
  id?: string;
  style?: CSSProperties;
}

export const Container = ({
  componentName,
  className,
  fullScreen,
  edgeToEdge,
  maxWidthOverride,
  topPadded = true,
  bottomPadded = true,
  children,
  tag = 'section',
  id,
}: ContainerProps & PropsWithChildren) => {
  const Tag = tag;

  return (
    <Tag
      className={cn(
        componentName,
        'mb-10 md:mb-20',
        className,
        !topPadded && 'pt-0',
        !bottomPadded && 'mb-0 md:mb-0'
      )}
      id={id}
    >
      <div
        className={cn(
          'w-full px-5 mx-auto',
          !fullScreen && 'max-w-xl-desktop',
          maxWidthOverride,
          edgeToEdge && 'px-0'
        )}
      >
        {children}
      </div>
    </Tag>
  );
};
