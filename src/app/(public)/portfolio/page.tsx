import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PortfolioGrid } from './portfolio-grid'
import type { Project } from '@/lib/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse our portfolio of staged short-term rental properties across California.',
}

export default async function PortfolioPage() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const projects = (data ?? []) as Project[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Our Work
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-500">
            Every project is designed for STR performance. Browse by property type,
            style, or budget to find inspiration for your listing.
          </p>
        </div>
      </section>

      <PortfolioGrid projects={projects} />
    </>
  )
}
