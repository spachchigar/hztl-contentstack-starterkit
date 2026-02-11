// Global
import React, { useEffect, useState, JSX } from 'react';

// Local
import { ReplacementToken } from '@/utils/string-utils';
import { CSLPFieldMapping } from '@/.generated';
import { getCSLPAttributes } from '@/utils/type-guards';

interface RichTextWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  fallbacks?: (string | undefined)[];
  tokens?: ReplacementToken[];
  cslpAttribute?: CSLPFieldMapping
}

const RichTextWrapper = ({
  content,
  fallbacks,
  tokens,
  className,
  cslpAttribute,
  ...props
}: RichTextWrapperProps): JSX.Element => {

  const updatedContent = useUpdatedRichTextContent({ content });

  // We should only render if it has a value
  if (!updatedContent) return <></>;

  return (
    <div
      {...props}
      className={`rte ${className ?? ''}`}
      data-component="helpers/fieldwrappers/richtextwrapper"
      dangerouslySetInnerHTML={{ __html: updatedContent }}
      {...getCSLPAttributes(cslpAttribute)}
    />
  );
};

const NEW_TAB_ICON_STRING = `<span class="svg-icon inline-flex align-middle -ml-3 h-6 w-6">
    <svg
      aria-hidden="true"
      class="inline ml-2 -mt-1 h-em w-em"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z"
        clipRule="evenodd"
        fillRule="evenodd"
      ></path>
    </svg>
  </span>`;

function useUpdatedRichTextContent({ content }: RichTextWrapperProps) {
  // Replace tokens if present
  const [updatedContent, setUpdatedContent] = useState<string>(content || '');

  // Run this client-side because we don't have access to the document server-side
  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = content || '';

    // Find all links either either have target="_blank" or appear to be external due to starting with "http"
    const externalLinks = [...template.content.querySelectorAll('a')].filter(
      (a) =>
        a.attributes.getNamedItem('href')?.value.startsWith('http') ||
        a.attributes.getNamedItem('target')?.value === '_blank'
    );
    // Update each external link
    externalLinks.forEach((a) => {
      // Set to open in new tab
      a.setAttribute('target', '_blank');
      // Add Screen Reader text and new tab icon
      a.innerHTML = `${a.innerHTML}<span class="sr-only"> (Opens in a new tab)</span> ${NEW_TAB_ICON_STRING}`;
    });

    // Add data-column attributes to table cells
    const tables = template.content.querySelectorAll('table');
    tables.forEach((table) => {
      const headerElements = table.querySelectorAll('thead th');

      // Only proceed if there are th elements
      if (headerElements.length > 0) {
        const headers = Array.from(headerElements).map((th) => th.textContent?.trim() || '');

        const cells = table.querySelectorAll('tbody td, tbody th');
        cells.forEach((cell, index) => {
          const columnIndex = index % headers.length;
          cell.setAttribute('data-column', headers[columnIndex]);
        });
      }
    });

    // Update the content
    setUpdatedContent(template.innerHTML);
  }, [content]);

  return updatedContent;
}

export default RichTextWrapper;
