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
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-primary font-semibold text-lg">You are on the list.</p>
        <p className="text-gray-600 text-sm mt-1">We will notify you when new properties are listed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        maxLength={254}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-accent text-white font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : 'Get Notified'}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm mt-1 w-full">{errorMsg}</p>
      )}
    </form>
  )
}
