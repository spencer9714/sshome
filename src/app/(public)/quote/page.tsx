import { QuoteForm } from './quote-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Request a personalized staging quote for your short-term rental property in California.',
}

export default function QuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Get a Quote
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-500">
            Tell us about your property and goals. We&rsquo;ll put together a personalized
            staging plan and quote within 2 business days.
          </p>
          <p className="mt-3 text-sm text-stone-400">
            Prefer to talk first?{' '}
            <a
              href="https://calendly.com/sshomestaging"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 underline hover:text-stone-900"
            >
              Book a call instead
            </a>
          </p>
        </div>
      </section>

      <QuoteForm />
    </>
  )
}
