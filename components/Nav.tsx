import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/listings' },
  { label: "Buyer's Guide", href: '/guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-primary font-bold text-xl tracking-tight">
          Portugal Real Estate
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/listings"
          className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Browse Listings
        </Link>
      </div>
    </header>
  )
}
