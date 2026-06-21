
// import './globals.css';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'DeskScrolls',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }





import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DeskScrolls',
  description: 'Curated desk setup tours from designers, founders, and builders.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>

        {/* Pinterest domain verification */}
        <meta name="p:domain_verify" content="bc00c994ba968ef1c058dc5be0b577c2" />

        {/* Google Fonts — Inter + Playfair Display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}