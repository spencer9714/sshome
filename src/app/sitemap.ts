import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { createServiceRoleClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createServiceRoleClient()
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('is_published', true)

    if (projects) {
      projectPages = projects.map((project) => ({
        url: `${SITE_URL}/portfolio/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // If Supabase is not configured, skip dynamic pages
  }

  return [...staticPages, ...projectPages]
}
