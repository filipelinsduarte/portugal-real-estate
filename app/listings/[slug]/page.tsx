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
  return {
    title,
    description: listing.description.slice(0, 160),
    alternates: { canonical: `https://www.portugalrealestateforsale.com/listings/${slug}` },
    openGraph: { title, description: listing.description.slice(0, 160), url: `https://www.portugalrealestateforsale.com/listings/${slug}` },
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
    address: { '@type': 'PostalAddress', streetAddress: listing.address, addressLocality: listing.city, addressCountry: 'PT' },
    numberOfRooms: listing.bedrooms,
    floorSize: { '@type': 'QuantitativeValue', value: listing.size_sqm, unitCode: 'MTK' },
  }
}

function formatPrice(price: number) {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon', porto: 'Porto', algarve: 'Algarve', 'silver-coast': 'Silver Coast', alentejo: 'Alentejo',
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) notFound()

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
      <SchemaMarkup schema={buildSchema(listing)} />
      <SchemaMarkup schema={breadcrumb} />

      <div className="page-px max-w-site mx-auto py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 flex-wrap">
          <a href="/" className="breadcrumb">Home</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <a href="/listings" className="breadcrumb">Listings</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <a href={`/region/${listing.region}`} className="breadcrumb">{REGION_LABELS[listing.region] ?? listing.region}</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <span className="breadcrumb text-[#151515]">{listing.neighbourhood}</span>
        </nav>

        {/* Main image */}
        <div
          className="w-full bg-[#f5f5f5] flex items-center justify-center text-[#adadad] text-[11px] uppercase tracking-[1px] mb-8"
          style={{ aspectRatio: '16/7', maxHeight: '520px' }}
        >
          {listing.images.length > 0
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            : 'No photos available'}
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="md:col-span-2">
            <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-2">
              {REGION_LABELS[listing.region]} · {listing.neighbourhood} · {listing.city}
            </p>
            <h1 className="font-serif font-normal text-[32px] text-[#151515] leading-[1.15] mb-3">{listing.title}</h1>
            <p className="text-[14px] text-[#606060] mb-6">{listing.address}</p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-0 mb-8" style={{ border: '1px solid #e0e0e0' }}>
              {[
                { label: 'Price', value: formatPrice(listing.price) },
                { label: 'Size', value: `${listing.size_sqm} m²` },
                { label: 'Bedrooms', value: listing.bedrooms > 0 ? String(listing.bedrooms) : 'Studio' },
                { label: 'Bathrooms', value: String(listing.bathrooms) },
                { label: 'Type', value: listing.type.charAt(0).toUpperCase() + listing.type.slice(1) },
                ...(listing.floor ? [{ label: 'Floor', value: String(listing.floor) }] : []),
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className="flex-1 p-4"
                  style={{ borderRight: i < arr.length - 1 ? '1px solid #e0e0e0' : 'none', minWidth: '100px' }}
                >
                  <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-1">{stat.label}</p>
                  <p className="text-[15px] font-semibold text-[#151515]">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '32px' }}>
              <h2 className="font-serif font-normal text-[20px] text-[#151515] mb-4">About this property</h2>
              <p className="text-[14px] text-[#606060] leading-6">{listing.description}</p>
            </div>

            {/* Features */}
            {listing.features.length > 0 && (
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '32px' }}>
                <h2 className="font-serif font-normal text-[20px] text-[#151515] mb-4">Features</h2>
                <ul className="grid grid-cols-2 gap-y-2">
                  {listing.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-[#606060]">
                      <span className="w-1 h-1 bg-[#006c75] rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-[82px]" style={{ border: '1px solid #e0e0e0', padding: '24px' }}>
              <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-1">Asking price</p>
              <p className="font-serif font-normal text-[32px] text-[#151515] mb-1">{formatPrice(listing.price)}</p>
              {listing.size_sqm > 0 && (
                <p className="text-[13px] text-[#adadad] mb-6">
                  {Math.round(listing.price / listing.size_sqm).toLocaleString('en-GB')} EUR/m²
                </p>
              )}
              <a
                href={`/contact?ref=${listing.slug}`}
                className="btn-brand w-full mb-3 text-center"
                style={{ padding: '13px 20px', fontSize: '14px', display: 'block', textAlign: 'center' }}
              >
                Enquire about this property
              </a>
              <a
                href="/listings"
                className="btn-ghost w-full text-center"
                style={{ padding: '11px 20px', fontSize: '13px', display: 'block', textAlign: 'center' }}
              >
                Back to listings
              </a>
              {listing.idealista_url && (
                <a
                  href={listing.idealista_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[12px] text-[#adadad] mt-4"
                  style={{ textDecoration: 'underline' }}
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
