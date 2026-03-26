import Link from 'next/link'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/listings' },
  { label: "Buyer's Guide", href: '/guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Portugal Real Estate</h3>
            <p className="text-green-200 text-sm leading-relaxed">
              Helping foreign buyers find property in Portugal. Listings across Lisbon, Porto, the Algarve and beyond.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-green-300">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-green-200 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-green-300">Contact</h3>
            <p className="text-green-200 text-sm">
              Questions about buying property in Portugal?
            </p>
            <Link
              href="/contact"
              className="inline-block mt-3 text-sm font-semibold text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Portugal Real Estate for Sale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
