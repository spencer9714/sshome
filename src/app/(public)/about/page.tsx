import Link from 'next/link'
import { Section, SectionHeader } from '@/components/layout/section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about SSHome Staging — California\'s STR-focused staging and design studio.',
}

const DIFFERENTIATORS = [
  {
    title: 'STR-First Mindset',
    description: 'We don\'t stage for open houses. Every design decision is made for short-term rental performance — bookings, reviews, and nightly rate.',
  },
  {
    title: 'Design + ROI Thinking',
    description: 'We balance aesthetics with business outcomes. Beautiful spaces that also drive real returns for hosts and investors.',
  },
  {
    title: 'Durable & Maintainable',
    description: 'Guest-proof materials, easy-to-clean surfaces, and replaceable components. Designed for hundreds of turnovers, not just the listing photos.',
  },
  {
    title: 'Photo-Ready Always',
    description: 'Every room is staged specifically for professional photography. We design with the camera — and the algorithm — in mind.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            About SSHome
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-500">
            We build spaces that perform. Not just beautiful — bookable.
          </p>
        </div>
      </section>

      {/* Story */}
      <Section narrow>
        <SectionHeader title="Our Story" />
        <div className="space-y-5 text-stone-600 leading-relaxed">
          <p>
            SSHome Staging was founded with a simple observation: most staging companies
            design for real estate sales. Open houses. Buyer appeal. But the short-term
            rental market is fundamentally different — and it needs a different approach.
          </p>
          <p>
            STR guests don&rsquo;t just look at a space. They live in it. They cook in the
            kitchen, lounge on the sofa, sleep in the beds. Every piece of furniture needs
            to be durable, functional, and photogenic. Every room needs to tell a story
            that makes travelers click &ldquo;Book Now.&rdquo;
          </p>
          <p>
            We built SSHome around this insight. Our team combines interior design expertise
            with deep knowledge of STR operations, listing optimization, and guest psychology.
            We don&rsquo;t just make properties look good — we make them perform.
          </p>
        </div>
      </Section>

      {/* Why STR */}
      <Section className="bg-stone-50">
        <SectionHeader
          title="Why We Focus on STR"
          subtitle="Short-term rentals demand a specialized approach that traditional staging can't deliver."
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {DIFFERENTIATORS.map((item) => (
            <div key={item.title} className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Area */}
      <Section narrow>
        <SectionHeader title="Where We Work" />
        <div className="space-y-5 text-stone-600 leading-relaxed">
          <p>
            SSHome serves all of California, with deep experience in the Bay Area,
            Central Valley, Southern California, and popular destination markets including:
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              'San Francisco Bay Area',
              'Mountain View & Peninsula',
              'Central Valley (Visalia, Fresno)',
              'Palm Springs & Desert',
              'Joshua Tree',
              'San Diego',
              'Santa Barbara',
              'Napa & Wine Country',
              'Lake Tahoe & Arrowhead',
            ].map((area) => (
              <li key={area} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-warm-400" />
                {area}
              </li>
            ))}
          </ul>
          <p>
            For properties outside California, our <strong>Design-Only</strong> package
            delivers remote design plans with curated sourcing lists — available nationwide.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-stone-900 text-center">
        <h2 className="text-3xl font-semibold text-white">
          Let&rsquo;s design your next high-performing listing
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-stone-300">
          Whether you&rsquo;re launching a new STR or refreshing an existing one,
          we&rsquo;re here to help.
        </p>
        <div className="mt-8">
          <Link
            href="/quote"
            className="inline-flex items-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            Get a Quote
          </Link>
        </div>
      </Section>
    </>
  )
}
