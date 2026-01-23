// Load before anything else
import '@/lib/preload';

import React from 'react';
import '@/assets/app.css';
import '@/assets/themes/index.css';

// RootLayout component that wraps the entire application
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  return (
    <html lang="en">
      {/* Setting the language attribute for the HTML document */}
      <head>
        {/* Preconnect to Contentstack CDN for faster image/asset loading */}
        <link rel="preconnect" href="https://images.contentstack.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://eu-images.contentstack.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
