// Global
import React, { JSX } from 'react';

//Local
import { useContentWithFallbacks } from '@/lib/hooks/useContentWithFallbacks';
import { ReplacementToken, tokenReplace } from '@/lib/utils/string-utils';

interface PlainTextWrapperProps extends React.HTMLAttributes<HTMLHeadingElement> {
  fallbacks?: (string | undefined)[];
  tokens?: ReplacementToken[];
  tag?: string;
}

const PlainTextWrapper = ({
  content,
  fallbacks,
  tokens,
  className,
  tag = 'span',
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
    />
  );
};

function useUpdatedPlainTextContent({ content, tokens }: PlainTextWrapperProps) {
  const plainTextContent = tokens ? tokenReplace(content?.toString(), tokens) : content;

  return plainTextContent || '';
}

export default PlainTextWrapper;
