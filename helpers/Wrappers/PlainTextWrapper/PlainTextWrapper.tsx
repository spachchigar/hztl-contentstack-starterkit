// Global
import React, { JSX } from 'react';

//Local
import { useContentWithFallbacks } from '@/lib/hooks/useContentWithFallbacks';
import { ReplacementToken, tokenReplace } from '@/utils/string-utils';
import { getCSLPAttributes } from '@/utils/type-guards';
import { CSLPFieldMapping } from '@/.generated';

interface PlainTextWrapperProps extends React.HTMLAttributes<HTMLHeadingElement> {
  fallbacks?: (string | undefined)[];
  tokens?: ReplacementToken[];
  tag?: string;
  cslpAttribute?: CSLPFieldMapping
}

const PlainTextWrapper = ({
  content,
  fallbacks,
  tokens,
  className,
  tag = 'span',
  cslpAttribute,
  ...props
}: PlainTextWrapperProps): JSX.Element => {
  const renderedContent = useContentWithFallbacks(content, fallbacks);

  const updatedContent = useUpdatedPlainTextContent({
    content: renderedContent,
    tokens,
  });

  if (!updatedContent) return <></>;

  const Tag: React.ElementType = tag as React.ElementType;

  return (
    <Tag
      {...props}
      data-component="helpers/fieldwrappers/plaintextwrapper"
      className={className}
      dangerouslySetInnerHTML={{ __html: updatedContent }}
      {...getCSLPAttributes(cslpAttribute)}
    />
  );
};

function useUpdatedPlainTextContent({ content, tokens }: PlainTextWrapperProps) {
  const plainTextContent = tokens ? tokenReplace(content?.toString(), tokens) : content;

  return plainTextContent || '';
}

export default PlainTextWrapper;
