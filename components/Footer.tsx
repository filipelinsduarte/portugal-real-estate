import Link from 'next/link'

const col1 = [
  { label: 'Listings', href: '/listings' },
  { label: 'Lisbon', href: '/region/lisbon' },
  { label: 'Porto', href: '/region/porto' },
  { label: 'Algarve', href: '/region/algarve' },
  { label: 'Silver Coast', href: '/region/silver-coast' },
  { label: 'Alentejo', href: '/region/alentejo' },
]

const col2 = [
  { label: "Buyer's Guide", href: '/guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="page-px max-w-site mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="font-serif text-[20px] text-white mb-4" style={{ textDecoration: 'none' }}>Portugal Real Estate for Sale</p>
            <p className="text-[14px] leading-6" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '320px' }}>
              Curated property listings across Lisbon, Porto, the Algarve, Silver Coast, and Alentejo. Built for international buyers.
            </p>
          </div>
          <div>
            <p className="section-label mb-5">Browse</p>
            <ul className="space-y-3">
              {col1.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-5">Company</p>
            <ul className="space-y-3">
              {col2.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '64px', paddingTop: '32px' }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; 2025 Portugal Real Estate for Sale. All rights reserved.
          </p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Property listings in Portugal for international buyers.
          </p>
        </div>
      </div>
    </footer>
  )
}
