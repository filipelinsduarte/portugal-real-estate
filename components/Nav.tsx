import Link from 'next/link'

const navLinks = [
  { label: 'Listings', href: '/listings' },
  { label: "Buyer's Guide", href: '/guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  return (
    <header style={{ borderBottom: '1px solid #eaeaea' }} className="bg-white sticky top-0 z-50">
      <div className="page-px max-w-site mx-auto flex items-center justify-between" style={{ height: '66px' }}>
        <Link href="/" className="font-serif text-[20px] text-[#151515] tracking-tight" style={{ textDecoration: 'none' }}>
          Portugal Real Estate
        </Link>
        <nav className="hidden md:flex items-center" style={{ gap: '43px' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/listings" className="btn-brand btn-pill hidden md:inline-flex" style={{ height: '38px', padding: '8px 20px', fontSize: '13px' }}>
          Browse Listings
        </Link>
        {/* Mobile menu placeholder */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span className="w-5 h-px bg-[#151515] block" />
          <span className="w-5 h-px bg-[#151515] block" />
          <span className="w-5 h-px bg-[#151515] block" />
        </button>
      </div>
    </header>
  )
}
