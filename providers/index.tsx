'use client';
import { IDictionaryItems } from '@/.generated';
import { GlobalLabelsProvider } from '@/context/GlobalLabelContext';
// IMPORTANT: Register CLIENT components for client-side bundle
// This ensures ComponentMapper has client components available during hydration
import '@/temp/registered-client-components';

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
