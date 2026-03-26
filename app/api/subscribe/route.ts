import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim()

    // Sanitize and validate
    if (!email || email.length > 254) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 })
    }

    // TODO: Connect to email provider (Mailchimp / ConvertKit / Resend)
    // For now, log and return success
    console.log('New subscriber:', email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
