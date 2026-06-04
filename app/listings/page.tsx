import type { Metadata } from 'next'
import listings from '@/data/listings.json'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'Property Listings in Portugal',
  description: 'Browse real estate listings for sale in Portugal. Apartments, villas and houses in Lisbon, Porto, Algarve and beyond.',
  alternates: { canonical: 'https://www.portugalrealestateforsale.com/listings' },
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
  lisbon: 'Lisbon', porto: 'Porto', algarve: 'Algarve', 'silver-coast': 'Silver Coast', alentejo: 'Alentejo',
}

function formatPrice(price: number) {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default function ListingsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <div className="page-px max-w-site mx-auto py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8">
          <a href="/" className="breadcrumb">Home</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <span className="breadcrumb text-[#151515]">Listings</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-normal text-[32px] text-[#151515] mb-1">Properties for Sale in Portugal</h1>
            <p className="text-[14px] text-[#606060]">{listings.length} properties available</p>
          </div>
        </div>

        {/* Region filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <a href="/listings" className="filter-pill active">All regions</a>
          {Object.entries(REGION_LABELS).map(([slug, label]) => (
            <a key={slug} href={`/region/${slug}`} className="filter-pill">{label}</a>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {listings.map((listing) => (
            <a key={listing.id} href={`/listings/${listing.slug}`} className="card-listing block group" style={{ textDecoration: 'none' }}>
              <div
                className="bg-[#f5f5f5] flex items-center justify-center text-[#adadad] text-[11px] uppercase tracking-[1px]"
                style={{ aspectRatio: '13/8' }}
              >
                {listing.images.length > 0
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  : 'No Photo'}
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-1">
                  {REGION_LABELS[listing.region]} · {listing.neighbourhood}
                </p>
                <p className="text-[14px] text-[#151515] leading-5 mb-3 group-hover:text-[#006c75] transition-colors line-clamp-2">
                  {listing.title}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-[16px] font-semibold text-[#151515]">{formatPrice(listing.price)}</p>
                  <p className="text-[12px] text-[#adadad]">{listing.size_sqm} m²</p>
                </div>
                <p className="text-[12px] text-[#adadad] mt-1 capitalize">
                  {listing.bedrooms > 0 ? `${listing.bedrooms} bed` : 'Studio'} · {listing.bathrooms} bath · {listing.type}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
