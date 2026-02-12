import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/layout/section'
import { getImageUrl } from '@/lib/utils'
import type { Project, ProjectImage } from '@/lib/types/database'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('projects')
    .select('title, summary, city, state, cover_image_path')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const project = data as Pick<Project, 'title' | 'summary' | 'city' | 'state' | 'cover_image_path'> | null

  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} - ${project.city}, ${project.state}`,
    description: project.summary || `STR staging project in ${project.city}, ${project.state}`,
    openGraph: {
      images: project.cover_image_path
        ? [{ url: getImageUrl(project.cover_image_path) }]
        : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const project = projectData as Project | null
  if (!project) notFound()

  const { data: imagesData } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true })

  const images = (imagesData ?? []) as ProjectImage[]

  const beforeImages = images.filter((img) => img.is_before)
  const afterImages = images.filter((img) => img.is_after)
  const galleryImages = images.filter((img) => !img.is_before && !img.is_after)

  // Group gallery images by space
  const spaceGroups = galleryImages.reduce<Record<string, typeof galleryImages>>((acc, img) => {
    const space = img.space || 'Other'
    if (!acc[space]) acc[space] = []
    acc[space].push(img)
    return acc
  }, {})

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] bg-stone-900">
        {project.cover_image_path && (
          <Image
            src={getImageUrl(project.cover_image_path)}
            alt={project.title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/portfolio"
              className="mb-4 inline-flex items-center gap-1 text-sm text-stone-300 hover:text-white"
            >
              <span aria-hidden="true">&larr;</span> Back to Portfolio
            </Link>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            {project.summary && (
              <p className="mt-3 max-w-2xl text-lg text-stone-200">{project.summary}</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            <Fact label="Location" value={`${project.city}, ${project.state}`} />
            <Fact label="Property Type" value={project.property_type} />
            {project.bedrooms && project.bathrooms && (
              <Fact label="Beds / Baths" value={`${project.bedrooms} / ${project.bathrooms}`} />
            )}
            {project.budget_range && <Fact label="Budget Range" value={project.budget_range} />}
            {project.goal && <Fact label="Goal" value={project.goal} />}
            {project.timeline_weeks && (
              <Fact label="Timeline" value={`${project.timeline_weeks} weeks`} />
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.style_tags.map((tag) => (
              <Badge key={tag} variant="warm">{tag}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      {beforeImages.length > 0 && afterImages.length > 0 && (
        <Section>
          <h2 className="mb-8 text-2xl font-semibold text-stone-900">Before & After</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-400">Before</h3>
              <div className="grid gap-4">
                {beforeImages.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={getImageUrl(img.path)}
                      alt={img.caption || 'Before'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-400">After</h3>
              <div className="grid gap-4">
                {afterImages.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={getImageUrl(img.path)}
                      alt={img.caption || 'After'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* What We Did */}
      {project.what_we_did && (
        <Section className="bg-stone-50">
          <h2 className="mb-6 text-2xl font-semibold text-stone-900">What We Did</h2>
          <div className="prose prose-stone max-w-3xl">
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{project.what_we_did}</p>
          </div>
        </Section>
      )}

      {/* Design Decisions */}
      {project.design_notes && (
        <Section>
          <h2 className="mb-6 text-2xl font-semibold text-stone-900">Design Decisions</h2>
          <div className="prose prose-stone max-w-3xl">
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{project.design_notes}</p>
          </div>
        </Section>
      )}

      {/* Gallery by Space */}
      {Object.keys(spaceGroups).length > 0 && (
        <Section className="bg-stone-50">
          <h2 className="mb-8 text-2xl font-semibold text-stone-900">Gallery</h2>
          {Object.entries(spaceGroups).map(([space, imgs]) => (
            <div key={space} className="mb-12 last:mb-0">
              <h3 className="mb-4 text-lg font-medium text-stone-700">{space}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {imgs.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={getImageUrl(img.path)}
                      alt={img.caption || space}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-sm text-white">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* CTA */}
      <Section className="bg-stone-900 text-center">
        <h2 className="text-3xl font-semibold text-white">Start Your Project</h2>
        <p className="mx-auto mt-4 max-w-xl text-stone-300">
          Ready to create a listing that performs? Let&rsquo;s talk about your property.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-stone-900">{value}</dd>
    </div>
  )
}
