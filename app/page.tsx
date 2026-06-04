import type { Metadata } from 'next'
import Link from 'next/link'
import SchemaMarkup from '@/components/SchemaMarkup'
import EmailOptIn from '@/components/EmailOptIn'
import listings from '@/data/listings.json'

export const metadata: Metadata = {
  title: 'Portugal Real Estate for Sale | Find Property in Portugal',
  description: 'Browse properties for sale in Portugal. Apartments, villas and houses in Lisbon, Porto, Algarve and beyond. Curated listings for international buyers.',
  alternates: {
    canonical: 'https://www.portugalrealestateforsale.com',
  },
  openGraph: {
    title: 'Portugal Real Estate for Sale | Find Property in Portugal',
    description: 'Browse properties for sale in Portugal. Curated listings for international buyers.',
    url: 'https://www.portugalrealestateforsale.com',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Portugal Real Estate for Sale',
  url: 'https://www.portugalrealestateforsale.com',
  description: 'Portugal real estate directory helping foreign buyers find property across Lisbon, Porto, Algarve and beyond.',
  areaServed: { '@type': 'Country', name: 'Portugal' },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Portugal Real Estate for Sale',
  url: 'https://www.portugalrealestateforsale.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.portugalrealestateforsale.com/listings?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

const regions = [
  { name: 'Lisbon', slug: 'lisbon', tagline: 'Capital city living', body: 'Apartments and townhouses across Alfama, Chiado, Bairro Alto, and Parque das Nações. The most liquid market in Portugal.' },
  { name: 'Porto', slug: 'porto', tagline: 'Northern cultural capital', body: 'Ribeira apartments, Foz do Douro villas, and restored historic buildings. Strong short-term rental demand.' },
  { name: 'Algarve', slug: 'algarve', tagline: 'Southern coastline', body: 'Villas with pools, beachside apartments, and golf properties. Year-round sunshine and Europe\'s longest sandy coastline.' },
  { name: 'Silver Coast', slug: 'silver-coast', tagline: 'Atlantic character', body: 'Authentic Portugal within 1 hour of Lisbon. Cottages, farmhouses, and village homes at a fraction of capital prices.' },
  { name: 'Alentejo', slug: 'alentejo', tagline: 'Wine country estates', body: 'Traditional Monte farmhouses, vineyards, and country estates near UNESCO-listed Évora. Europe\'s most unspoiled wine region.' },
]

const featuredListings = listings.slice(0, 4)

function formatPrice(price: number) {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon', porto: 'Porto', algarve: 'Algarve', 'silver-coast': 'Silver Coast', alentejo: 'Alentejo',
}

export default function HomePage() {
  return (
    <>
      <SchemaMarkup schema={[organizationSchema, websiteSchema]} />

      {/* Hero */}
      <section className="bg-[#efede8]">
        <div className="page-px max-w-site mx-auto py-20 md:py-28">
          <p className="section-label mb-6">Portugal Property Market</p>
          <h1 className="font-serif font-normal text-[#151515] mb-6" style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.1', maxWidth: '680px' }}>
            Find Your Property in Portugal
          </h1>
          <p className="text-[16px] text-[#606060] mb-10 leading-7" style={{ maxWidth: '480px' }}>
            Curated real estate listings across Lisbon, Porto, the Algarve, Silver Coast, and Alentejo. Built for international buyers.
          </p>
          <div className="flex flex-wrap gap-3 mb-14">
            <Link href="/listings" className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
              Browse Listings
            </Link>
            <Link href="/guide" className="btn-ghost" style={{ padding: '12px 28px', fontSize: '14px' }}>
              Buyer's Guide
            </Link>
          </div>
          <div>
            <p className="text-[12px] text-[#717171] uppercase tracking-[1px] mb-3">Get notified when new properties are listed</p>
            <EmailOptIn />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="page-px max-w-site mx-auto py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif font-normal text-[28px] text-[#151515]">Featured Properties</h2>
          <Link href="/listings" className="text-[13px] text-[#006c75]" style={{ textDecoration: 'underline', textDecorationColor: '#006c75', textUnderlineOffset: '4px' }}>
            View all listings
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.slug}`} className="card-listing block group" style={{ textDecoration: 'none' }}>
              <div className="bg-[#f5f5f5] flex items-center justify-center text-[#adadad] text-[11px] uppercase tracking-[1px]" style={{ aspectRatio: '13/8' }}>
                No Photo
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[1px] text-[#adadad] mb-1">{REGION_LABELS[listing.region]} · {listing.neighbourhood}</p>
                <p className="text-[14px] text-[#151515] leading-5 mb-3 group-hover:text-[#006c75] transition-colors" style={{ textDecoration: 'none' }}>{listing.title}</p>
                <p className="text-[16px] font-semibold text-[#151515]">{formatPrice(listing.price)}</p>
                <p className="text-[12px] text-[#adadad] mt-1">{listing.size_sqm} m²{listing.bedrooms > 0 ? ` · ${listing.bedrooms} bed` : ' · Studio'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="page-px max-w-site mx-auto"><div style={{ borderTop: '1px solid #e0e0e0' }} /></div>

      {/* Regions */}
      <section className="page-px max-w-site mx-auto py-16">
        <h2 className="font-serif font-normal text-[28px] text-[#151515] mb-10">Browse by Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0" style={{ border: '1px solid #e0e0e0' }}>
          {regions.map((region, i) => (
            <Link
              key={region.slug}
              href={`/region/${region.slug}`}
              className="block p-6 group"
              style={{
                textDecoration: 'none',
                borderRight: i < regions.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <p className="section-label mb-3">{region.tagline}</p>
              <p className="font-serif font-normal text-[18px] text-[#151515] mb-3 group-hover:text-[#006c75] transition-colors">{region.name}</p>
              <p className="text-[13px] text-[#606060] leading-5">{region.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="page-px max-w-site mx-auto"><div style={{ borderTop: '1px solid #e0e0e0' }} /></div>

      {/* Why Portugal */}
      <section className="page-px max-w-site mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif font-normal text-[28px] text-[#151515] mb-6">Why international buyers choose Portugal</h2>
            <p className="text-[14px] text-[#606060] leading-6 mb-8">
              Portugal has become one of Europe's most sought-after destinations for property investment and relocation. Competitive prices, a stable legal framework, and an exceptional quality of life make it an attractive market for buyers from across the world.
            </p>
            <Link href="/guide" className="btn-primary" style={{ padding: '12px 28px' }}>
              Read the buyer's guide
            </Link>
          </div>
          <div className="space-y-0" style={{ border: '1px solid #e0e0e0' }}>
            {[
              { title: 'Competitive prices', body: 'Property remains significantly cheaper than equivalent markets in France, Spain, or the UK, with strong appreciation in key cities.' },
              { title: 'NHR tax regime', body: 'Non-habitual resident status offers significant tax advantages for qualifying foreign residents for up to 10 years.' },
              { title: 'EU residency pathways', body: 'Multiple residency options available including the D7 passive income visa and investment-based routes for non-EU nationals.' },
              { title: 'Quality of life', body: 'Ranked among the safest countries globally. Warm climate, excellent infrastructure, English widely spoken in urban areas.' },
            ].map((item, i) => (
              <div key={item.title} className="p-6" style={{ borderBottom: i < 3 ? '1px solid #e0e0e0' : 'none' }}>
                <p className="text-[14px] font-semibold text-[#151515] mb-2">{item.title}</p>
                <p className="text-[13px] text-[#606060] leading-5">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
