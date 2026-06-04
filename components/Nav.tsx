import Link from 'next/link'

const links = [
  { label: 'Listings', href: '/listings' },
  { label: 'Lisbon', href: '/region/lisbon' },
  { label: 'Algarve', href: '/region/algarve' },
  { label: 'Porto', href: '/region/porto' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 200, background: '#fff', height: 'var(--nav-h)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--pad)' }}>
      <Link href="/" style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '22px', color: 'var(--ink)', textDecoration: 'none' }}>
        Portugal Real Estate<span style={{ color: 'var(--muted)' }}>.</span>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
