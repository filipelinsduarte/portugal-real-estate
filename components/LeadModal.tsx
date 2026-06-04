'use client'

import { useState, useEffect } from 'react'

interface LeadModalProps {
  isOpen: boolean
  initialRegion?: string
  onClose: () => void
}

export default function LeadModal({ isOpen, initialRegion = '', onClose }: LeadModalProps) {
  const [region, setRegion] = useState(initialRegion)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setRegion(initialRegion) }, [initialRegion])
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleClose() {
    onClose()
    setTimeout(() => setSubmitted(false), 400)
  }

  if (!isOpen) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(26,26,26,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div style={{ background: '#fff', maxWidth: '520px', width: '100%', padding: '40px', position: 'relative' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '22px', color: 'var(--muted)', cursor: 'pointer', lineHeight: 1 }} aria-label="Close">&times;</button>

        {!submitted ? (
          <>
            <h3 style={{ fontFamily: 'Prata, serif', fontWeight: 400, fontSize: '22px', marginBottom: '6px' }}>Tell us what you are looking for</h3>
            <p style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '28px' }}>We will match you with a specialist agent in your target area within 24 hours. Free for buyers, always.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>First name</label>
                  <input type="text" placeholder="Your name" required style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>WhatsApp or phone <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input type="tel" placeholder="+44 7700 000000" style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>Region of interest</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} required style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', appearance: 'none' }}>
                    <option value="">Select a region</option>
                    <option>Lisbon</option>
                    <option>Porto</option>
                    <option>Algarve</option>
                    <option>Silver Coast</option>
                    <option>Alentejo</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>Property type</label>
                  <select style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', appearance: 'none' }}>
                    <option value="">Any type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                    <option>Farmhouse</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>Budget range</label>
                  <select style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', appearance: 'none' }}>
                    <option value="">Select budget</option>
                    <option>Under €250,000</option>
                    <option>€250,000 to €500,000</option>
                    <option>€500,000 to €1,000,000</option>
                    <option>Over €1,000,000</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>When to buy</label>
                  <select style={{ border: '1px solid var(--border)', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', appearance: 'none' }}>
                    <option value="">Select timeline</option>
                    <option>Within 3 months</option>
                    <option>3 to 6 months</option>
                    <option>6 to 12 months</option>
                    <option>Just researching</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px', cursor: 'pointer', marginTop: '6px', transition: 'background 0.15s' }}>
                Connect Me With an Agent
              </button>
              <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>We share your details only with your matched agent. No spam, no cold calls from us.</p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0f7f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="#2d7a2d" strokeWidth="1.5"/><path d="M6.5 11l3 3 6-6" stroke="#2d7a2d" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3 style={{ fontFamily: 'Prata, serif', fontWeight: 400, fontSize: '22px', marginBottom: '8px' }}>You are matched.</h3>
            <p style={{ fontSize: '13px', color: 'var(--secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              We have sent your details to a specialist agent in <strong>{region || 'your selected region'}</strong>. Most buyers hear back within a few hours during business days.
            </p>
            <a href="/listings" onClick={handleClose} style={{ fontSize: '13px', color: 'var(--ink)', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
              Browse properties while you wait &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
