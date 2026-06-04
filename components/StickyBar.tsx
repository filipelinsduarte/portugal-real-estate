'use client'

import { useState, useEffect } from 'react'

interface StickyBarProps {
  onOpenModal: () => void
  heroRef: React.RefObject<HTMLElement | null>
}

export default function StickyBar({ onOpenModal, heroRef }: StickyBarProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function onScroll() {
      if (dismissed) return
      const heroBottom = heroRef.current ? heroRef.current.getBoundingClientRect().bottom + window.scrollY : 400
      setVisible(window.scrollY > heroBottom - 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed, heroRef])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5vw', height: '52px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }} className="hidden md:block">Free agent matching for Portugal property buyers</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenModal}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '9px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
        >
          Connect Me to an Agent &rarr;
        </button>
        <button
          onClick={() => { setDismissed(true); setVisible(false) }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
          aria-label="Dismiss"
        >&times;</button>
      </div>
    </div>
  )
}
