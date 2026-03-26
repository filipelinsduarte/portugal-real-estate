import type { Metadata } from 'next'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: "Buyer's Guide: How to Buy Property in Portugal",
  description: 'Complete guide for foreign buyers purchasing real estate in Portugal. Legal process, taxes, NHR, mortgages and more.',
  alternates: {
    canonical: 'https://www.portugalrealestateforsale.com/guide',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.portugalrealestateforsale.com' },
    { '@type': 'ListItem', position: 2, name: "Buyer's Guide", item: 'https://www.portugalrealestateforsale.com/guide' },
  ],
}

export default function GuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How to Buy Property in Portugal as a Foreign Buyer
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            A comprehensive buyer&apos;s guide is in development. It will cover the full purchase process, taxes (IMT, IMI, stamp duty), NHR status, mortgage options for non-residents, and legal requirements.
          </p>
          <p className="text-gray-500 text-sm">
            Leave your email on the{' '}
            <a href="/" className="text-accent font-semibold hover:underline">homepage</a>{' '}
            to be notified when the guide is published.
          </p>
        </div>
      </section>
    </>
  )
}
