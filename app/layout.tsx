import './globals.css'
import type { Metadata } from 'next'

const siteUrl = 'https://deskscroll.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'DeskScroll | Desk Setups, Workspace Ideas & Gear',
    template: '%s | DeskScroll',
  },

  description:
    'Discover real desk setups, workspace inspiration, gear, products, and practical guides for building a better workspace.',

  applicationName: 'DeskScroll',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'DeskScroll',
    title: 'DeskScroll | Desk Setups, Workspace Ideas & Gear',
    description:
      'Discover real desk setups, workspace inspiration, gear, products, and practical guides for building a better workspace.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DeskScroll | Desk Setups, Workspace Ideas & Gear',
    description:
      'Discover real desk setups, workspace inspiration, gear, products, and practical guides for building a better workspace.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="p:domain_verify"
          content="bc00c994ba968ef1c058dc5be0b577c2"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
