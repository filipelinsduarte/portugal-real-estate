'use client'

import { useRef, useState } from 'react'
import HeroSlideshow from '@/components/HeroSlideshow'
import LeadModal from '@/components/LeadModal'
import StickyBar from '@/components/StickyBar'
import listings from '@/data/listings.json'

const REGION_LABELS: Record<string, string> = {
  lisbon: 'Lisbon', porto: 'Porto', algarve: 'Algarve',
  'silver-coast': 'Silver Coast', alentejo: 'Alentejo',
}

const REGION_THUMBS: Record<string, string> = {
  lisbon: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=120&q=70',
  porto: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=120&q=70',
  algarve: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=120&q=70',
  'silver-coast': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=120&q=70',
  alentejo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=120&q=70',
}

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80',
]

const MARQUEE_ITEMS = [
  'Golden Visa Program', 'NHR Tax Regime', '300 Days of Sunshine',
  'EU Member State', 'Safe & Stable', 'World-Class Healthcare',
  'Low Cost of Living', 'English Widely Spoken',
]

function formatPrice(price: number) {
  return price.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const featured = listings.slice(0, 4)

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalRegion, setModalRegion] = useState('')

  function openModal(region = '') {
    setModalRegion(region)
    setModalOpen(true)
  }

  return (
    <>
      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position: 'relative', padding: '120px var(--pad) 100px', borderBottom: '1px solid var(--border)', overflow: 'hidden', minHeight: '560px' }}>
        <HeroSlideshow />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'rgba(255,255,255,0.5)' }} />
            Free agent matching for international buyers
          </p>
          <h1 style={{ fontFamily: 'Prata, Georgia, serif', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 54px)', color: '#fff', marginBottom: '18px', maxWidth: '600px', lineHeight: 1.15 }}>
            Find Property in Portugal
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '480px', marginBottom: '36px', lineHeight: 1.7 }}>
            Tell us what you are looking for and we will connect you with a vetted, English-speaking Portuguese agent who knows your target area. No fees, no obligations.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/listings" className="btn btn-accent" style={{ padding: '13px 26px' }}>Browse Properties &rarr;</a>
            <button onClick={() => openModal()} className="btn btn-ghost-light" style={{ padding: '13px 26px' }}>Connect Me to an Agent</button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '56px var(--pad)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }} className="how-grid">
          {[
            { n: '01', title: 'Tell us what you want', body: 'Share your budget, preferred region, and property type. Takes under two minutes.' },
            { n: '02', title: 'We match you with a specialist', body: 'We connect you with a licensed agent who specialises in your exact area and speaks your language.' },
            { n: '03', title: 'Your agent handles everything', body: 'From shortlist to signed deed. Viewings, negotiation, legal guidance, and post-sale support.' },
          ].map((step, i) => (
            <div key={step.n} style={{ padding: '0 40px 0 0', borderRight: i < 2 ? '1px solid var(--border)' : 'none', marginRight: i < 2 ? '40px' : 0 }}>
              <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '32px', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1 }}>{step.n}</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{step.title}</p>
              <p style={{ fontSize: '13px', color: 'var(--secondary)', lineHeight: 1.6 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', padding: '0 20px' }}>{item}</span>
              <span style={{ color: 'var(--accent)', padding: '0 4px' }}>&middot;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured Listings ── */}
      <section style={{ padding: '72px var(--pad)', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '8px' }}>Active listings</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Properties for Sale in Portugal</h2>
          </div>
          <a href="/listings" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--secondary)', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
            Browse all &rarr;
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="listings-grid">
          {featured.map((listing, i) => (
            <article key={listing.id} className="listing-card">
              <div style={{ aspectRatio: '13/8', background: '#d6cfc7', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: listing.listed_at > '2025-11-01' ? 'var(--accent)' : 'var(--ink)', color: '#fff', fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 9px', zIndex: 1 }}>
                  {listing.listed_at > '2025-11-01' ? 'New' : 'For Sale'}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CARD_IMAGES[i]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>{listing.type}</p>
                <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '16px', color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.3 }}>{listing.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0, display: 'inline-block' }} />
                  {listing.city}, Portugal
                </p>
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '14px' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '19px', color: 'var(--ink)' }}>{formatPrice(listing.price)}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{listing.bedrooms > 0 ? `${listing.bedrooms} bed` : 'Studio'}</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{listing.size_sqm} m²</span>
                  </div>
                </div>
                <button
                  onClick={() => openModal(listing.city)}
                  style={{ width: '100%', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', padding: '9px', cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  Enquire about this property
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mid-grid capture strip */}
        <div style={{ marginTop: '24px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontFamily: 'Prata, Georgia, serif', fontWeight: 400, fontSize: '20px', marginBottom: '4px' }}>Not finding what you need?</h3>
            <p style={{ fontSize: '13px', color: 'var(--secondary)' }}>Tell us your criteria and we will find matching properties you will not see on public portals.</p>
          </div>
          <button onClick={() => openModal()} className="btn btn-primary" style={{ flexShrink: 0 }}>Get a Free Shortlist</button>
        </div>
      </section>

      {/* ── Regions ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px var(--pad)' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="section-label" style={{ marginBottom: '8px' }}>Browse by location</p>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>Where in Portugal?</h2>
        </div>
        <div style={{ border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }} className="regions-panel">
          {Object.entries(REGION_LABELS).map(([slug, label], i) => (
            <div
              key={slug}
              onClick={() => openModal(label)}
              style={{ padding: '28px 24px', borderRight: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>0{i + 1}</p>
                <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '20px', color: 'var(--ink)', marginBottom: '6px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>View properties</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={REGION_THUMBS[slug]}
                alt={label}
                style={{ width: '60px', height: '60px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)', marginLeft: '12px', alignSelf: 'center' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Case for Portugal ── */}
      <section style={{ padding: '80px var(--pad)', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="case-grid">
          <div>
            <p className="section-label" style={{ marginBottom: '10px' }}>The case for Portugal</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '8px' }}>Why Buyers Choose Portugal</h2>
            <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '16px', color: 'var(--secondary)', fontWeight: 400, marginBottom: '18px', lineHeight: 1.4 }}>Consistently ranked among Europe's most liveable countries.</p>
            <p style={{ fontSize: '14px', color: 'var(--secondary)', lineHeight: 1.8, marginBottom: '16px', maxWidth: '420px' }}>
              Portugal consistently ranks among Europe&apos;s most liveable countries. With a stable economy, welcoming visa programs, mild climate year-round and a rich cultural heritage, it is no surprise that international buyers are choosing Portugal as a permanent home, second residence, or investment property.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--secondary)', lineHeight: 1.8, marginBottom: '28px', maxWidth: '420px' }}>
              Our team specialises in guiding international buyers through the entire purchase process, from property search through to legal completion, in full transparency and with no hidden fees.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => openModal()} className="btn btn-primary">Talk to an Advisor</button>
              <a href="/listings" className="btn btn-ghost">Browse Properties</a>
            </div>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid var(--border)', marginBottom: '20px' }}>
              {[
                { num: '300+', label: 'Days of sunshine per year' },
                { num: '#3', label: 'Safest country in Europe, 2024' },
                { num: '20%', label: 'Flat NHR income tax rate for residents' },
                { num: '1.1k', label: 'km of Atlantic coastline' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ padding: '22px 20px', borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <p style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '32px', color: 'var(--ink)', lineHeight: 1, marginBottom: '6px' }}>{stat.num}</p>
                  <p style={{ fontSize: '12px', color: 'var(--secondary)', lineHeight: 1.4 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: '22px 24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>Free Buying Guide</p>
              <p style={{ fontSize: '12px', color: 'var(--secondary)', lineHeight: 1.6, marginBottom: '14px' }}>Download our 2025 guide to buying property in Portugal as a foreigner, including legal steps, taxes, and costs explained.</p>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink)', borderBottom: '1px solid var(--border)', paddingBottom: '1px', cursor: 'pointer' }}>
                Download Guide &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Use This Service ── */}
      <section style={{ padding: '72px var(--pad)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="value-grid">
          <div>
            <p className="section-label" style={{ marginBottom: '10px' }}>Why buying in Portugal</p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: '16px' }}>The right market.<br />The right guidance.</h2>
            <p style={{ fontSize: '14px', color: 'var(--secondary)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '380px' }}>
              Portugal offers some of the most compelling buying conditions in Europe: stable legal framework, no restrictions on foreign buyers, competitive prices relative to Western Europe, and a quality of life that is hard to match.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/listings" className="btn btn-primary">Browse Properties &rarr;</a>
              <button onClick={() => openModal()} className="btn btn-ghost">Connect Me to an Agent</button>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)' }}>
            {[
              { title: 'No buyer fees, ever', body: 'This service costs buyers nothing. You get matched with a qualified local agent at zero cost, with no obligation to proceed.' },
              { title: 'Vetted local agents, not a listings portal', body: 'We connect you directly with a licensed Portuguese agent who specialises in your target region. Not a generic database. Not an algorithm.' },
              { title: 'One form, the right expert for your search', body: 'Whether you are buying in Lisbon, the Algarve, or a quiet Silver Coast village, we match you with a specialist who knows that market deeply.' },
              { title: '47 buyers matched this month', body: "Portugal's popular listings go under offer within 2 to 4 weeks. Most buyers we match hear from their agent the same day they enquire." },
            ].map((prop, i) => (
              <div key={prop.title} style={{ padding: '22px 24px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{prop.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--secondary)', lineHeight: 1.6 }}>{prop.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px var(--pad)', background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }} className="faq-grid">
          <div>
            <p className="section-label" style={{ marginBottom: '8px' }}>Common questions</p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: '12px' }}>Buying property in Portugal as a foreigner</h2>
            <p style={{ fontSize: '13px', color: 'var(--secondary)', lineHeight: 1.6 }}>Everything you need to know before you start your search.</p>
          </div>
          <div>
            {[
              { q: 'Can foreigners buy property in Portugal?', a: 'Yes. Portugal places no restrictions on foreign nationals purchasing property. Non-EU and EU citizens alike can buy freely following the same legal steps as Portuguese nationals: promissory contract, fiscal number (NIF), and final deed at a notary. A local solicitor is strongly recommended to handle due diligence.' },
              { q: 'What are the costs of buying property in Portugal?', a: 'Budget for 6 to 8 percent of the purchase price in transaction costs. This covers IMT transfer tax (0 to 8 percent depending on value), stamp duty at 0.8 percent, notary and land registry fees, and legal fees of 1 to 2 percent. Our agent matching service costs buyers nothing.' },
              { q: 'What is the Portugal NHR tax regime?', a: 'Non-Habitual Resident status offers qualifying new tax residents a flat 20 percent rate on Portuguese-source income and potential exemptions on foreign-source income for 10 years. You qualify by not having been a Portuguese tax resident in the previous 5 years.' },
              { q: 'What are the best areas to buy property in Portugal?', a: 'Lisbon offers the most liquid market with strong capital appreciation. The Algarve suits buyers prioritising lifestyle and rental yield. Porto delivers strong short-term rental returns at lower entry prices. The Silver Coast and Alentejo offer authentic Portugal at 40 to 60 percent below Lisbon prices.' },
              { q: 'Is Portugal real estate a good investment in 2025?', a: 'Portugal has seen consistent price growth averaging 7 to 10 percent annually in prime urban markets since 2017. Gross rental yields in Lisbon range from 3 to 5 percent, higher in Porto and the Algarve. Strong tourism demand and limited housing supply continue to support the market.' },
            ].map((item, i) => (
              <details key={item.q} style={{ borderBottom: '1px solid var(--border)', ...(i === 0 ? { borderTop: '1px solid var(--border)' } : {}) }}>
                <summary style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', padding: '18px 0', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.q}
                  <span style={{ fontSize: '18px', fontWeight: 300, color: 'var(--muted)', flexShrink: 0, marginLeft: '16px' }}>+</span>
                </summary>
                <p style={{ fontSize: '13px', color: 'var(--secondary)', lineHeight: 1.7, paddingBottom: '18px' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Modal + Sticky Bar */}
      <LeadModal isOpen={modalOpen} initialRegion={modalRegion} onClose={() => setModalOpen(false)} />
      <StickyBar onOpenModal={() => openModal()} heroRef={heroRef} />
    </>
  )
}
