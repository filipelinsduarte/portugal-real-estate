import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import listings from '@/data/listings.json'
import SchemaMarkup from '@/components/SchemaMarkup'

const REGIONS: Record<string, { label: string; description: string }> = {
  lisbon: {
    label: 'Lisbon',
    description: "Browse properties for sale in Lisbon, Portugal's vibrant capital. From historic Alfama townhouses to modern Parque das Nações apartments, find your ideal Lisbon property.",
  },
  porto: {
    label: 'Porto',
    description: 'Explore real estate for sale in Porto, Portugal\'s second city. Ribeira apartments, Foz do Douro villas, and restored buildings in the historic centre.',
  },
  algarve: {
    label: 'Algarve',
    description: "Discover properties in the Algarve, Portugal's premier coastal region. Villas with pools, beachside apartments, and golf resort properties in Albufeira, Lagos, Vilamoura, and beyond.",
  },
  'silver-coast': {
    label: 'Silver Coast',
    description: 'Find real estate on Portugal\'s Silver Coast (Costa de Prata). Affordable houses and cottages in Óbidos, Peniche, Nazaré, and the Bombarral wine region — just 1 hour from Lisbon.',
  },
  alentejo: {
    label: 'Alentejo',
    description: "Browse Alentejo properties for sale. Traditional Monte farmhouses, vineyards, and country estates in Europe's most unspoiled wine country — near Évora, Beja, and Mértola.",
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
    alternates: {
      canonical: `https://www.portugalrealestateforsale.com/region/${region}`,
    },
  }
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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/listings" className="hover:text-primary">Listings</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{r.label}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Properties for Sale in {r.label}</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">{r.description}</p>

        {regionListings.length === 0 ? (
          <p className="text-gray-500">No listings in this region yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionListings.map((listing) => (
              <a
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="border rounded-xl overflow-hidden hover:shadow-md transition group"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Photo</div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{listing.neighbourhood}, {listing.city}</p>
                  <h2 className="font-semibold text-primary group-hover:underline text-sm mb-2 leading-snug">{listing.title}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-accent">
                      {listing.price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-gray-400">{listing.size_sqm} m²</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
