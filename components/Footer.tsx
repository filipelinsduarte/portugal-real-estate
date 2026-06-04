import Link from 'next/link'

const browse = [
  { label: 'All listings', href: '/listings' },
  { label: 'Lisbon', href: '/region/lisbon' },
  { label: 'Porto', href: '/region/porto' },
  { label: 'Algarve', href: '/region/algarve' },
  { label: 'Silver Coast', href: '/region/silver-coast' },
  { label: 'Alentejo', href: '/region/alentejo' },
]

const company = [
  { label: "Buyer's Guide", href: '/guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer id="contact" style={{ background: 'var(--ink)', color: '#fff', padding: '64px var(--pad) 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '48px' }} className="footer-grid">
        <div>
          <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '22px', marginBottom: '14px' }}>
            Portugal Real Estate<span style={{ color: 'var(--muted)' }}>.</span>
          </p>
          <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', maxWidth: '280px' }}>
            Free agent matching for international buyers of Portuguese property. Lisbon, Porto, Algarve, Silver Coast, and Alentejo.
          </p>
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>Browse</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {browse.map((l) => (
              <li key={l.href}><Link href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>Company</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {company.map((l) => (
              <li key={l.href}><Link href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{l.label}</Link></li>
            ))}
          </ul>
          <a href="mailto:hello@portugalrealestateforsale.com" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
            hello@portugalrealestateforsale.com
          </a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>&copy; 2025 Portugal Real Estate for Sale. All rights reserved.</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Property listings in Portugal for international buyers.</p>
      </div>
    </footer>
  )
}
