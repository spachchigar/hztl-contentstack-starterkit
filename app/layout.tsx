import React from 'react';
import '@/assets/app.css';
import { Scripts } from '@/components/primitives/Scripts';
import PageViewTracker from '@/components/primitives/PageViewTracker';
// IMPORTANT: Register SERVER components for server-side bundle
// This ensures ComponentMapper has server components available during SSR
import '@/temp/registered-server-components';

// RootLayout component that wraps the entire application
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  return (
    <html lang="en">
      <Scripts />
      <PageViewTracker />
      <body>{children}</body>
    </html>
  );
}
