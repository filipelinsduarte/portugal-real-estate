import type { Metadata } from 'next'
import Link from 'next/link'
import SchemaMarkup from '@/components/SchemaMarkup'
import EmailOptIn from '@/components/EmailOptIn'

export const metadata: Metadata = {
  title: 'Portugal Real Estate for Sale | Find Property in Portugal',
  description: 'Browse properties for sale in Portugal. Find apartments, villas and houses in Lisbon, Porto, Algarve and beyond. Helping foreign buyers navigate the Portuguese property market.',
  alternates: {
    canonical: 'https://www.portugalrealestateforsale.com',
  },
  openGraph: {
    title: 'Portugal Real Estate for Sale | Find Property in Portugal',
    description: 'Browse properties for sale in Portugal. Find apartments, villas and houses in Lisbon, Porto, Algarve and beyond.',
    url: 'https://www.portugalrealestateforsale.com',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Portugal Real Estate for Sale',
  url: 'https://www.portugalrealestateforsale.com',
  description: 'Portugal real estate directory helping foreign buyers find property across Lisbon, Porto, Algarve and beyond.',
  areaServed: {
    '@type': 'Country',
    name: 'Portugal',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Portugal Real Estate for Sale',
  url: 'https://www.portugalrealestateforsale.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.portugalrealestateforsale.com/listings?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.portugalrealestateforsale.com',
    },
  ],
}

const regions = [
  {
    name: 'Lisbon',
    description: 'Apartments, townhouses and modern developments in the capital. Strong rental market and high demand from international buyers.',
    href: '/listings?region=lisbon',
    emoji: '🌉',
  },
  {
    name: 'Porto',
    description: 'Historic city with a growing tech scene. Competitive prices compared to Lisbon. Strong short-term rental demand.',
    href: '/listings?region=porto',
    emoji: '🍷',
  },
  {
    name: 'Algarve',
    description: 'Southern coastline with year-round sun. Popular for retirement, holiday homes and golf properties.',
    href: '/listings?region=algarve',
    emoji: '🌊',
  },
]

export default function HomePage() {
  return (
    <>
      <SchemaMarkup schema={[organizationSchema, websiteSchema, breadcrumbSchema]} />

      {/* Hero */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Find Your Property in Portugal
          </h1>
          <p className="text-green-200 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Browse real estate listings across Lisbon, Porto, the Algarve and beyond. Built for foreign buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/listings"
              className="bg-accent text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              Browse Listings
            </Link>
            <Link
              href="/guide"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary transition-colors text-center"
            >
              Get the Buyer&apos;s Guide
            </Link>
          </div>
          <div className="bg-green-900 bg-opacity-50 rounded-xl p-6 inline-block text-left w-full max-w-md">
            <p className="text-green-200 text-sm font-medium mb-3">Get notified when new properties are listed</p>
            <EmailOptIn />
          </div>
        </div>
      </section>

      {/* Featured Regions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-3">
            Browse by Region
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
            Portugal offers diverse property markets across its regions. Each area has different price points, lifestyle, and investment potential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Link
                key={region.name}
                href={region.href}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3">{region.emoji}</div>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:underline">{region.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{region.description}</p>
                <span className="inline-block mt-4 text-accent text-sm font-semibold">
                  View {region.name} listings &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Portugal */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            Why foreign buyers choose Portugal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Competitive prices', body: 'Property prices remain lower than most Western European markets, with strong appreciation potential in key cities.' },
              { title: 'NHR tax regime', body: 'Non-habitual resident status offers tax advantages for qualifying foreign residents. Legal and tax advice is essential.' },
              { title: 'EU residency options', body: 'Various residency pathways available for non-EU buyers, including the D7 passive income visa and investment routes.' },
              { title: 'Quality of life', body: 'Ranked among the safest countries in the world. Warm climate, good infrastructure, English widely spoken in cities.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/guide"
              className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Read the complete buyer&apos;s guide
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
