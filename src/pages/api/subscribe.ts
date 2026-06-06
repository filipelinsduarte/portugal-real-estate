import type { APIRoute } from 'astro'

// On-demand (serverless) route — not prerendered.
export const prerender = false

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim()

    // Sanitize and validate
    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // TODO: Connect to email provider (Mailchimp / ConvertKit / Resend)
    // For now, log and return success
    console.log('New subscriber:', email)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
