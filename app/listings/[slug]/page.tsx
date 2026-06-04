import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import listings from '@/data/listings.json'
import SchemaMarkup from '@/components/SchemaMarkup'

type Listing = typeof listings[0]

function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug)
}

export async function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) return {}

  const priceFormatted = listing.price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const title = `${listing.title} — ${priceFormatted}`
  const description = listing.description.slice(0, 160)

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.portugalrealestateforsale.com/listings/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.portugalrealestateforsale.com/listings/${slug}`,
    },
  }
}

function buildSchema(listing: Listing) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `https://www.portugalrealestateforsale.com/listings/${listing.slug}`,
    datePosted: listing.listed_at,
    price: listing.price,
    priceCurrency: listing.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressCountry: 'PT',
    },
    numberOfRooms: listing.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: listing.size_sqm,
      unitCode: 'MTK',
    },
  }
}

function formatPrice(price: number): string {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon',
  porto: 'Porto',
  algarve: 'Algarve',
  'silver-coast': 'Silver Coast',
  alentejo: 'Alentejo',
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) notFound()

  const schema = buildSchema(listing)
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.portugalrealestateforsale.com' },
      { '@type': 'ListItem', position: 2, name: 'Listings', item: 'https://www.portugalrealestateforsale.com/listings' },
      { '@type': 'ListItem', position: 3, name: listing.title, item: `https://www.portugalrealestateforsale.com/listings/${listing.slug}` },
    ],
  }

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumb} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/listings" className="hover:text-primary">Listings</a>
          <span className="mx-2">/</span>
          <a href={`/region/${listing.region}`} className="hover:text-primary capitalize">{REGION_LABELS[listing.region] ?? listing.region}</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{listing.title}</span>
        </nav>

        {/* Image placeholder */}
        <div className="w-full h-64 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center mb-8 text-gray-400 text-sm">
          Photos coming soon
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{listing.title}</h1>
            <p className="text-gray-500 mb-4">{listing.address}</p>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              {listing.bedrooms > 0 && (
                <span className="bg-gray-50 border rounded px-3 py-1">{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
              )}
              {listing.bedrooms === 0 && (
                <span className="bg-gray-50 border rounded px-3 py-1">Studio</span>
              )}
              <span className="bg-gray-50 border rounded px-3 py-1">{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
              <span className="bg-gray-50 border rounded px-3 py-1">{listing.size_sqm} m²</span>
              <span className="bg-gray-50 border rounded px-3 py-1 capitalize">{listing.type}</span>
            </div>

            <h2 className="text-lg font-semibold text-primary mb-2">About this property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

            <h2 className="text-lg font-semibold text-primary mb-2">Features</h2>
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {listing.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div>
            <div className="border rounded-xl p-6 sticky top-6">
              <p className="text-3xl font-bold text-primary mb-1">{formatPrice(listing.price)}</p>
              <p className="text-sm text-gray-500 mb-6">
                {listing.size_sqm > 0 ? `${Math.round(listing.price / listing.size_sqm).toLocaleString('en-GB')} €/m²` : ''}
              </p>
              <a
                href={`/contact?ref=${listing.slug}`}
                className="block w-full text-center bg-accent text-white font-semibold py-3 rounded-lg hover:opacity-90 transition mb-3"
              >
                Enquire about this property
              </a>
              <a
                href="/listings"
                className="block w-full text-center border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                ← Back to listings
              </a>
              {listing.idealista_url && (
                <a
                  href={listing.idealista_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-xs text-gray-400 mt-4 hover:underline"
                >
                  View on Idealista
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
