// Global
import React, { JSX } from 'react';

//Local
import { getCSLPAttributes } from '@/utils/type-guards';
import { CSLPFieldMapping } from '@/.generated';

interface PlainTextWrapperProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  cslpAttribute?: CSLPFieldMapping
}

const PlainTextWrapper = ({
  content,
  className,
  tag = 'span',
  cslpAttribute,
  ...props
}: PlainTextWrapperProps): JSX.Element => {

  if (!content) return <></>;

  const Tag: React.ElementType = tag as React.ElementType;

  return (
    <Tag
      {...props}
      data-component="helpers/fieldwrappers/plaintextwrapper"
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
      {...getCSLPAttributes(cslpAttribute)}
    />
  );
};

export default PlainTextWrapper;
