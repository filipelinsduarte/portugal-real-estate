import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.portugalrealestateforsale.com'),
  title: {
    default: 'Portugal Real Estate for Sale | Find Property in Portugal',
    template: '%s | Portugal Real Estate for Sale',
  },
  description: 'Browse properties for sale in Portugal. Find apartments, villas and houses in Lisbon, Porto, Algarve and beyond. Helping foreign buyers navigate the Portuguese property market.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.portugalrealestateforsale.com',
    siteName: 'Portugal Real Estate for Sale',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F7ZGG3K604" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F7ZGG3K604');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
