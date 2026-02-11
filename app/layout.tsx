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
      <body>{children}</body>
    </html>
  );
}
