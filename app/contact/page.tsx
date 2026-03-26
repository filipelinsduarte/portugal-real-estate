'use client'

import { useState } from 'react'
import SchemaMarkup from '@/components/SchemaMarkup'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.portugalrealestateforsale.com' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.portugalrealestateforsale.com/contact' },
  ],
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    // TODO: connect to contact form endpoint
    setTimeout(() => setStatus('success'), 800)
  }

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a question about buying property in Portugal? Want to enquire about a listing? Send us a message and we will get back to you.
          </p>
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-primary font-semibold text-lg">Message sent.</p>
              <p className="text-gray-600 text-sm mt-1">We will get back to you within 1-2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-accent text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
