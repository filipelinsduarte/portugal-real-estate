'use client'

import { useState } from 'react'

export default function EmailOptIn() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-4 text-center" style={{ border: '1px solid #006c75' }}>
        <p className="text-[14px] font-medium text-[#151515]">You are on the list.</p>
        <p className="text-[12px] text-[#606060] mt-1">We will notify you when new properties are listed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        maxLength={254}
        className="flex-1 px-4 py-3 text-[14px] text-[#151515] bg-white focus:outline-none"
        style={{ border: '1px solid #e0e0e0', borderRight: 'none' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary whitespace-nowrap"
        style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}
      >
        {status === 'loading' ? 'Subscribing...' : 'Get Notified'}
      </button>
      {status === 'error' && (
        <p className="text-[#ec4850] text-[12px] mt-2 w-full">{errorMsg}</p>
      )}
    </form>
  )
}
