'use client';
import { IDictionaryItems } from '@/.generated';
import { GlobalLabelsProvider } from './GlobalLabelsProvider';
// Initialize component registry early to avoid circular dependencies
import '@/utils/init-component-registry';

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
