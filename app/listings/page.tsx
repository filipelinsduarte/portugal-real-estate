import type { Metadata } from 'next'
import listings from '@/data/listings.json'
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

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon',
  porto: 'Porto',
  algarve: 'Algarve',
  'silver-coast': 'Silver Coast',
  alentejo: 'Alentejo',
}

const TYPES = ['all', 'apartment', 'villa', 'townhouse', 'cottage', 'farmhouse']

export default function ListingsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Properties for Sale in Portugal</h1>
        <p className="text-gray-600 mb-8">
          {listings.length} properties across Lisbon, Porto, Algarve, Silver Coast and Alentejo
        </p>

        {/* Region filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(REGION_LABELS).map(([slug, label]) => (
            <a
              key={slug}
              href={`/region/${slug}`}
              className="text-sm border border-gray-200 rounded-full px-4 py-1.5 hover:bg-primary hover:text-white hover:border-primary transition"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Listings grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <a
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-md transition group"
            >
              <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                {listing.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <span>No photo</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 capitalize">{REGION_LABELS[listing.region] ?? listing.region} · {listing.neighbourhood}</p>
                <h2 className="font-semibold text-primary group-hover:underline text-sm mb-2 leading-snug line-clamp-2">{listing.title}</h2>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-accent">
                    {listing.price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-gray-400">{listing.size_sqm} m²</span>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  {listing.bedrooms > 0 && <span>{listing.bedrooms} bed</span>}
                  {listing.bedrooms === 0 && <span>Studio</span>}
                  <span>·</span>
                  <span>{listing.bathrooms} bath</span>
                  <span>·</span>
                  <span className="capitalize">{listing.type}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
