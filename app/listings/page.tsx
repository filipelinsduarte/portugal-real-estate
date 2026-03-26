import type { Metadata } from 'next'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'Property Listings in Portugal',
  description: 'Browse real estate listings for sale in Portugal. Apartments, villas and houses in Lisbon, Porto, Algarve and beyond.',
  alternates: {
    canonical: 'https://www.portugalrealestateforsale.com/listings',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.portugalrealestateforsale.com' },
    { '@type': 'ListItem', position: 2, name: 'Listings', item: 'https://www.portugalrealestateforsale.com/listings' },
  ],
}

export default function ListingsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Property Listings in Portugal</h1>
          <p className="text-gray-600 text-lg mb-8">
            Live property listings are coming soon. We are connecting to property data sources to bring you up-to-date listings across Portugal.
          </p>
          <p className="text-gray-500 text-sm">
            In the meantime, leave your email on the{' '}
            <a href="/" className="text-accent font-semibold hover:underline">homepage</a>{' '}
            to be notified when listings go live.
          </p>
        </div>
      </section>
    </>
  )
}
