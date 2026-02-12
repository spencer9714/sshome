import Link from 'next/link'
import { Section, SectionHeader } from '@/components/layout/section'
import { ProjectCard } from '@/components/portfolio/project-card'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Project } from '@/lib/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSHome Staging | STR Design & Staging in California',
}

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery Call',
    description: 'We learn about your property, goals, and target guests to develop the right design strategy.',
  },
  {
    step: '02',
    title: 'Design & Plan',
    description: 'We create a tailored design plan with style, layout, and furnishing selections optimized for STR performance.',
  },
  {
    step: '03',
    title: 'Source & Stage',
    description: 'We procure everything, coordinate delivery, and fully stage your property down to the last detail.',
  },
  {
    step: '04',
    title: 'Launch Ready',
    description: 'Your listing goes live with photo-ready interiors designed to attract bookings and five-star reviews.',
  },
]

const SERVICES = [
  {
    title: 'Turnkey Airbnb Launch',
    description: 'Full design, furnishing, and setup for new listings. Move-in ready for guests.',
    icon: '◈',
  },
  {
    title: 'Refresh / Re-Stage',
    description: 'Update tired spaces to boost bookings and justify higher nightly rates.',
    icon: '↻',
  },
  {
    title: 'Design-Only',
    description: 'Remote-friendly design plans with sourcing lists. You handle the setup.',
    icon: '▦',
  },
  {
    title: 'Add-Ons',
    description: 'Outdoor areas, kids rooms, themed rooms, and photo styling packages.',
    icon: '+',
  },
]

const FAQ_ITEMS = [
  {
    question: 'What areas do you serve?',
    answer: 'We serve all of California including the Bay Area, Central Valley, Southern California, and destination markets like Joshua Tree, Lake Tahoe, and Napa Valley. We also offer remote design-only packages nationwide.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Most turnkey projects are completed within 2-4 weeks from kickoff. Refreshes can often be done in 1-2 weeks. Timelines depend on property size and scope.',
  },
  {
    question: 'Do you work with existing furniture?',
    answer: 'Yes. Our refresh service evaluates what you have and strategically updates pieces, styling, and details to improve performance without starting from scratch.',
  },
  {
    question: 'What makes STR staging different from traditional staging?',
    answer: 'STR staging is permanent, functional, and guest-experience driven. Every piece must be durable, photographable, and contribute to a five-star stay. We design for nightly rate optimization, not just visual appeal.',
  },
  {
    question: 'Do you help with photography?',
    answer: 'We stage specifically for listing photography and can coordinate with professional photographers. Our photo styling add-on ensures every angle is optimized.',
  },
]

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  const featuredProjects = (data ?? []) as Project[]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Designing high-performing Airbnbs across California.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-300 sm:text-xl">
              We stage short-term rentals for maximum bookings, higher nightly rates,
              and five-star guest experiences. Photo-ready. Durable. Fast to launch.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
              >
                Get a Quote
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-lg border border-stone-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-stone-400 hover:bg-stone-800"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <Section>
          <SectionHeader
            title="Recent Projects"
            subtitle="See how we transform properties into high-performing short-term rentals."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              View all projects
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Section>
      )}

      {/* Services */}
      <Section className="bg-stone-50">
        <SectionHeader
          title="What We Do"
          subtitle="Tailored staging and design packages for every type of short-term rental."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm-100 text-lg text-warm-700">
                {service.icon}
              </span>
              <h3 className="mt-4 font-semibold text-stone-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
          >
            Learn more about our services
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeader
          title="How It Works"
          subtitle="From discovery to launch-ready in four straightforward steps."
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step}>
              <span className="text-3xl font-semibold text-stone-200">{step.step}</span>
              <h3 className="mt-2 font-semibold text-stone-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials placeholder */}
      <Section className="bg-warm-50">
        <SectionHeader title="What Hosts Say" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
              <p className="text-sm leading-relaxed text-stone-600 italic">
                &ldquo;SSHome completely transformed our listing. Bookings increased significantly
                within the first month and we&rsquo;ve had nothing but five-star reviews since.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-stone-200" />
                <div>
                  <p className="text-sm font-medium text-stone-900">Host Name</p>
                  <p className="text-xs text-stone-500">City, CA</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Answers to common questions about our staging and design services."
        />
        <div className="mx-auto max-w-3xl divide-y divide-stone-200">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-left font-medium text-stone-900">
                {item.question}
                <svg
                  className="ml-4 h-5 w-5 flex-shrink-0 text-stone-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-stone-900 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Ready to transform your rental?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-300">
          Let&rsquo;s design a space that books itself. Get a personalized quote for your property.
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
