import type { Metadata } from 'next'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Portugal Real Estate for Sale — a directory helping foreign buyers find property across Portugal.',
  alternates: {
    canonical: 'https://www.portugalrealestateforsale.com/about',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.portugalrealestateforsale.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.portugalrealestateforsale.com/about' },
  ],
}

export default function AboutPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">About Portugal Real Estate for Sale</h1>
          <div className="prose prose-lg text-gray-700 space-y-4">
            <p>
              Portugal Real Estate for Sale is a property directory built for foreign buyers navigating the Portuguese market. We aggregate listings and provide practical information to help international buyers make informed decisions.
            </p>
            <p>
              Whether you are looking for a city apartment in Lisbon, a villa in the Algarve, or a townhouse in Porto, our goal is to give you clear, accurate information about the Portuguese real estate market.
            </p>
            <p>
              We connect buyers with real estate agents who specialise in working with international clients. If you are interested in a property or need guidance on the buying process, use our{' '}
              <a href="/contact" className="text-accent font-semibold hover:underline">contact form</a>{' '}
              to get in touch.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
