'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=85', city: 'Lisbon' },
  { url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=1600&q=85', city: 'Porto' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=85', city: 'Algarve' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85', city: 'Silver Coast' },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* Slide backgrounds */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.city}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url('${slide.url}')`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.68) 0%, rgba(8,8,8,0.28) 100%)' }} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '24px', left: 'var(--pad)', display: 'flex', gap: '8px', zIndex: 2 }}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.city}
            onClick={() => setCurrent(i)}
            aria-label={slide.city}
            style={{
              width: i === current ? '36px' : '20px',
              height: '2px', border: 'none', padding: 0,
              background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              transition: 'background 0.3s, width 0.3s',
            }}
          />
        ))}
      </div>
    </>
  )
}
