import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import listings from '@/data/listings.json'
import SchemaMarkup from '@/components/SchemaMarkup'

const REGIONS: Record<string, { label: string; tagline: string; description: string }> = {
  lisbon: {
    label: 'Lisbon',
    tagline: 'Capital city living',
    description: "Browse properties for sale in Lisbon, Portugal's vibrant capital. From historic Alfama townhouses to modern Parque das Nações apartments, find your ideal Lisbon property.",
  },
  porto: {
    label: 'Porto',
    tagline: 'Northern cultural capital',
    description: "Explore real estate for sale in Porto. Ribeira apartments, Foz do Douro villas, and restored buildings in the historic centre of Portugal's second city.",
  },
  algarve: {
    label: 'Algarve',
    tagline: 'Southern coastline',
    description: "Discover properties in the Algarve, Portugal's premier coastal region. Villas with pools, beachside apartments, and golf resort properties in Albufeira, Lagos, Vilamoura, and beyond.",
  },
  'silver-coast': {
    label: 'Silver Coast',
    tagline: 'Atlantic character',
    description: "Find real estate on Portugal's Silver Coast. Affordable houses and cottages in Óbidos, Peniche, Nazaré, and the Bombarral wine region — just 1 hour from Lisbon.",
  },
  alentejo: {
    label: 'Alentejo',
    tagline: 'Wine country estates',
    description: "Browse Alentejo properties for sale. Traditional Monte farmhouses, vineyards, and country estates in Europe's most unspoiled wine country near Évora, Beja, and Mértola.",
  },
}

export async function generateStaticParams() {
  return Object.keys(REGIONS).map((region) => ({ region }))
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params
  const r = REGIONS[region]
  if (!r) return {}
  return {
    title: `Properties for Sale in ${r.label}, Portugal`,
    description: r.description,
    alternates: { canonical: `https://www.portugalrealestateforsale.com/region/${region}` },
  }
}

function formatPrice(price: number) {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon', porto: 'Porto', algarve: 'Algarve', 'silver-coast': 'Silver Coast', alentejo: 'Alentejo',
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const r = REGIONS[region]
  if (!r) notFound()

  const regionListings = listings.filter((l) => l.region === region)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Properties for Sale in ${r.label}, Portugal`,
    description: r.description,
    numberOfItems: regionListings.length,
    itemListElement: regionListings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.portugalrealestateforsale.com/listings/${l.slug}`,
      name: l.title,
    })),
  }

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="page-px max-w-site mx-auto py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8">
          <a href="/" className="breadcrumb">Home</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <a href="/listings" className="breadcrumb">Listings</a>
          <span className="text-[#afafaf] text-[11px]">/</span>
          <span className="breadcrumb text-[#151515]">{r.label}</span>
        </nav>

        {/* Header */}
        <p className="section-label mb-3">{r.tagline}</p>
        <h1 className="font-serif font-normal text-[32px] text-[#151515] mb-3">Properties for Sale in {r.label}</h1>
        <p className="text-[14px] text-[#606060] mb-10" style={{ maxWidth: '560px' }}>{r.description}</p>

        {/* Region filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <a href="/listings" className="filter-pill">All regions</a>
          {Object.entries(REGION_LABELS).map(([slug, label]) => (
            <a key={slug} href={`/region/${slug}`} className={`filter-pill${slug === region ? ' active' : ''}`}>{label}</a>
          ))}
        </div>

        {regionListings.length === 0 ? (
          <div className="py-16 text-center" style={{ border: '1px solid #e0e0e0' }}>
            <p className="text-[14px] text-[#606060]">No listings in this region yet.</p>
            <a href="/listings" className="btn-ghost mt-6 inline-flex" style={{ padding: '10px 20px' }}>Browse all listings</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {regionListings.map((listing) => (
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
                  <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-1">{listing.neighbourhood}</p>
                  <p className="text-[14px] text-[#151515] leading-5 mb-3 group-hover:text-[#006c75] transition-colors line-clamp-2">{listing.title}</p>
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
        )}
      </div>
    </>
  )
}
