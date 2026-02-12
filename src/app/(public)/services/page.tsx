import Link from 'next/link'
import { Section, SectionHeader } from '@/components/layout/section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Staging and design packages for short-term rentals. Turnkey launches, refreshes, design-only, and add-on services.',
}

const PACKAGES = [
  {
    title: 'Turnkey Airbnb Launch',
    subtitle: 'Full-service setup for new listings',
    idealFor: 'Hosts launching a new STR who want a professionally designed, guest-ready property from day one.',
    deliverables: [
      'On-site property assessment',
      'Full design concept & mood board',
      'Furniture, decor, and essentials sourcing',
      'Delivery, assembly, and full staging',
      'Styling for listing photography',
      'Guest essentials kit',
    ],
    timeline: '2-4 weeks',
    starting: 'Starting at $5,000 for service + furnishing budget',
  },
  {
    title: 'Refresh / Re-Stage',
    subtitle: 'Elevate an underperforming listing',
    idealFor: 'Existing hosts who want to boost bookings, justify higher rates, or update a tired space.',
    deliverables: [
      'Property evaluation & performance review',
      'Strategic update plan',
      'Selective furniture & decor upgrades',
      'Re-styling and photo optimization',
      'Guest experience improvements',
    ],
    timeline: '1-2 weeks',
    starting: 'Starting at $2,500 for service + furnishing budget',
  },
  {
    title: 'Design-Only',
    subtitle: 'Remote-friendly design plans',
    idealFor: 'Hosts outside our service area, DIY-minded hosts, or investors managing remotely.',
    deliverables: [
      'Virtual property assessment',
      'Full design plan with room layouts',
      'Curated sourcing list with links',
      'Style guide & color palette',
      'Placement guide with instructions',
    ],
    timeline: '1-2 weeks',
    starting: 'Starting at $1,500',
  },
]

const ADDONS = [
  {
    title: 'Outdoor Areas',
    description: 'Patios, pools, yards, and balconies styled for listing photos and guest enjoyment.',
  },
  {
    title: 'Kids Rooms',
    description: 'Family-friendly rooms with durable, fun design that appeals to traveling families.',
  },
  {
    title: 'Themed Rooms',
    description: 'Statement rooms designed to stand out in search results and drive bookings.',
  },
  {
    title: 'Photo Styling',
    description: 'Pre-shoot styling and on-site coordination for professional listing photography.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-500">
            We tailor every package to your property, market, and goals.
            Whether you need a full turnkey launch or a strategic refresh, we design for STR performance.
          </p>
        </div>
      </section>

      {/* Packages */}
      <Section>
        <SectionHeader
          title="Packages"
          subtitle="Choose the right level of support for your project."
        />
        <div className="space-y-8">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.title}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-stone-900">{pkg.title}</h3>
                    <p className="mt-1 text-stone-500">{pkg.subtitle}</p>

                    <div className="mt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Ideal For
                      </h4>
                      <p className="mt-2 text-sm text-stone-600">{pkg.idealFor}</p>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        What&rsquo;s Included
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {pkg.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-shrink-0 lg:text-right">
                    <div className="rounded-xl bg-stone-50 p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Typical Timeline
                      </p>
                      <p className="mt-1 text-sm font-medium text-stone-900">{pkg.timeline}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Investment
                      </p>
                      <p className="mt-1 text-sm font-medium text-stone-900">{pkg.starting}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Add-ons */}
      <Section className="bg-stone-50">
        <SectionHeader
          title="Add-Ons"
          subtitle="Enhance your staging with specialized services."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ADDONS.map((addon) => (
            <div
              key={addon.title}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <h3 className="font-semibold text-stone-900">{addon.title}</h3>
              <p className="mt-2 text-sm text-stone-500">{addon.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-stone-900 text-center">
        <h2 className="text-3xl font-semibold text-white">
          Not sure which package is right?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-stone-300">
          Tell us about your property and we&rsquo;ll recommend the best approach.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/quote"
            className="inline-flex items-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            Get a Quote
          </Link>
          <a
            href="https://calendly.com/sshomestaging"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-stone-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-stone-400"
          >
            Book a Call
          </a>
        </div>
      </Section>
    </>
  )
}
