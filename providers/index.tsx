'use client';
import { IDictionaryItems } from '@/.generated';
import { GlobalLabelsProvider } from '@/context/GlobalLabelContext';
// Initialize component registry early to avoid circular dependencies
import '@/temp/registered-components';

export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: {
    globalLabels: IDictionaryItems | object;
  };
}) {
  return (
    <GlobalLabelsProvider value={data}>{children}</GlobalLabelsProvider>
  );
}
