'use client'

import { useActionState, useState } from 'react'
import { submitQuote, type QuoteFormState } from './actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  PROPERTY_TYPES,
  STYLE_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  TARGET_GUEST_OPTIONS,
  TIMELINE_OPTIONS,
  FURNISHING_BUDGET_OPTIONS,
  SERVICE_BUDGET_OPTIONS,
  SCOPE_OPTIONS,
} from '@/lib/constants'
import { cn } from '@/lib/utils'

const STEPS = [
  'Contact',
  'Property',
  'Style & Goals',
  'Budget & Timeline',
  'Scope & Details',
]

export function QuoteForm() {
  const [step, setStep] = useState(0)
  const [state, formAction, isPending] = useActionState<QuoteFormState, FormData>(
    submitQuote,
    { success: false, error: null }
  )

  // Client-side selections for multi-select fields
  const [targetGuests, setTargetGuests] = useState<string[]>([])
  const [stylePrefs, setStylePrefs] = useState<string[]>([])
  const [scopeItems, setScopeItems] = useState<string[]>([])

  if (state.success) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-sage-200 bg-sage-50 p-12">
          <svg className="mx-auto h-12 w-12 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-stone-900">Quote request received!</h2>
          <p className="mt-3 text-stone-500">
            Thank you for your interest. We&rsquo;ll review your details and get back to you
            within 2 business days with a personalized quote.
          </p>
        </div>
      </section>
    )
  }

  const canGoNext = step < STEPS.length - 1
  const canGoBack = step > 0

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                'flex flex-col items-center gap-1.5 text-xs font-medium transition-colors',
                i === step ? 'text-stone-900' : i < step ? 'text-sage-600' : 'text-stone-400'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  i === step
                    ? 'bg-stone-900 text-white'
                    : i < step
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-stone-100 text-stone-400'
                )}
              >
                {i < step ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 h-1 rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-stone-900 transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form action={formAction}>
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Hidden fields for multi-select */}
        {targetGuests.map((v) => (
          <input key={v} type="hidden" name="target_guests" value={v} />
        ))}
        {stylePrefs.map((v) => (
          <input key={v} type="hidden" name="style_preferences" value={v} />
        ))}
        {scopeItems.map((v) => (
          <input key={v} type="hidden" name="scope" value={v} />
        ))}

        {/* Step 1: Contact */}
        <div className={cn(step === 0 ? 'block' : 'hidden')}>
          <h2 className="text-xl font-semibold text-stone-900">Contact Information</h2>
          <p className="mt-1 text-sm text-stone-500">How can we reach you?</p>
          <div className="mt-6 space-y-4">
            <Input id="name" name="name" label="Full Name *" required placeholder="Your name" />
            <Input id="email" name="email" type="email" label="Email *" required placeholder="you@email.com" />
            <Input id="phone" name="phone" type="tel" label="Phone" placeholder="(555) 123-4567" />
          </div>
        </div>

        {/* Step 2: Property */}
        <div className={cn(step === 1 ? 'block' : 'hidden')}>
          <h2 className="text-xl font-semibold text-stone-900">Property Details</h2>
          <p className="mt-1 text-sm text-stone-500">Tell us about the property.</p>
          <div className="mt-6 space-y-4">
            <Input id="city" name="city" label="City (California)" placeholder="e.g., Palm Springs" />
            <div>
              <label className="block text-sm font-medium text-stone-700">Property Type</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <label key={type} className="flex items-center">
                    <input type="radio" name="property_type" value={type} className="peer sr-only" />
                    <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="bedrooms" name="bedrooms" type="number" label="Bedrooms" min={0} />
              <Input id="bathrooms" name="bathrooms" type="number" label="Bathrooms" min={0} step={0.5} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Current Status</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CURRENT_STATUS_OPTIONS.map((status) => (
                  <label key={status} className="flex items-center">
                    <input type="radio" name="current_status" value={status} className="peer sr-only" />
                    <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Goals + Style */}
        <div className={cn(step === 2 ? 'block' : 'hidden')}>
          <h2 className="text-xl font-semibold text-stone-900">Style & Goals</h2>
          <p className="mt-1 text-sm text-stone-500">What kind of experience do you want to create?</p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Target Guests</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {TARGET_GUEST_OPTIONS.map((guest) => (
                  <label
                    key={guest}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors',
                      targetGuests.includes(guest)
                        ? 'border-stone-900 bg-stone-50 text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={targetGuests.includes(guest)}
                      onChange={() => {
                        setTargetGuests((prev) =>
                          prev.includes(guest) ? prev.filter((g) => g !== guest) : [...prev, guest]
                        )
                      }}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    {guest}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Style Preferences</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STYLE_OPTIONS.map((style) => (
                  <label
                    key={style}
                    className={cn(
                      'flex items-center justify-center rounded-lg border px-3 py-3 text-sm cursor-pointer transition-colors text-center',
                      stylePrefs.includes(style)
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={stylePrefs.includes(style)}
                      onChange={() => {
                        setStylePrefs((prev) =>
                          prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
                        )
                      }}
                      className="sr-only"
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Timeline + Budget */}
        <div className={cn(step === 3 ? 'block' : 'hidden')}>
          <h2 className="text-xl font-semibold text-stone-900">Budget & Timeline</h2>
          <p className="mt-1 text-sm text-stone-500">Help us understand your budget and timeline expectations.</p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700">Timeline</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map((t) => (
                  <label key={t} className="flex items-center">
                    <input type="radio" name="timeline" value={t} className="peer sr-only" />
                    <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Furnishing Budget</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {FURNISHING_BUDGET_OPTIONS.map((b) => (
                  <label key={b} className="flex items-center">
                    <input type="radio" name="budget_furnishing_range" value={b} className="peer sr-only" />
                    <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Service Budget</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SERVICE_BUDGET_OPTIONS.map((b) => (
                  <label key={b} className="flex items-center">
                    <input type="radio" name="budget_service_range" value={b} className="peer sr-only" />
                    <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Scope + Details */}
        <div className={cn(step === 4 ? 'block' : 'hidden')}>
          <h2 className="text-xl font-semibold text-stone-900">Scope & Details</h2>
          <p className="mt-1 text-sm text-stone-500">Almost done! Tell us what you need and any helpful links.</p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">What do you need?</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SCOPE_OPTIONS.map((s) => (
                  <label
                    key={s}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors',
                      scopeItems.includes(s)
                        ? 'border-stone-900 bg-stone-50 text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={scopeItems.includes(s)}
                      onChange={() => {
                        setScopeItems((prev) =>
                          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                        )
                      }}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <Textarea
              id="links"
              name="links"
              label="Links (listing URL, floor plan, photos folder — one per line)"
              rows={3}
              placeholder="https://airbnb.com/rooms/...&#10;https://drive.google.com/..."
            />
            <Textarea
              id="notes"
              name="notes"
              label="Anything else we should know?"
              rows={4}
              placeholder="Special requests, inspiration photos, concerns..."
            />
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <div>
            {canGoBack && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            )}
          </div>
          <div>
            {canGoNext ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" loading={isPending}>
                Submit Quote Request
              </Button>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}
