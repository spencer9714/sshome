'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export type QuoteFormState = {
  success: boolean
  error: string | null
}

export async function submitQuote(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  // Honeypot check
  const honeypot = formData.get('website') as string
  if (honeypot) {
    // Silently succeed to fool bots
    return { success: true, error: null }
  }

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null
  const city = (formData.get('city') as string)?.trim() || null
  const property_type = (formData.get('property_type') as string) || null
  const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : null
  const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : null
  const current_status = (formData.get('current_status') as string) || null
  const timeline = (formData.get('timeline') as string) || null
  const budget_furnishing_range = (formData.get('budget_furnishing_range') as string) || null
  const budget_service_range = (formData.get('budget_service_range') as string) || null
  const notes = (formData.get('notes') as string)?.trim() || null

  // Multi-select fields
  const target_guests = formData.getAll('target_guests') as string[]
  const style_preferences = formData.getAll('style_preferences') as string[]
  const scope = formData.getAll('scope') as string[]

  // Links (newline separated)
  const linksRaw = (formData.get('links') as string)?.trim() || ''
  const links = linksRaw ? linksRaw.split('\n').map((l) => l.trim()).filter(Boolean) : []

  // Validation
  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from('leads').insert({
      name,
      email,
      phone,
      city,
      property_type,
      bedrooms,
      bathrooms,
      current_status,
      target_guests,
      style_preferences,
      timeline,
      budget_furnishing_range,
      budget_service_range,
      scope,
      links,
      notes,
    })

    if (error) {
      console.error('Lead insert error:', error)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    // TODO: Send auto-reply email via Resend
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'SSHome Staging <hello@sshomestaging.com>',
    //   to: email,
    //   subject: 'We received your quote request!',
    //   html: '...',
    // })

    // TODO: Send Slack notification
    // await fetch(process.env.SLACK_WEBHOOK_URL!, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: `New lead: ${name} (${email}) - ${city}` }),
    // })

    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
