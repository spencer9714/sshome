'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types/database'

interface ProjectsFilterProps {
  projects: Project[]
}

export function ProjectsFilter({ projects: initialProjects }: ProjectsFilterProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [pubFilter, setPubFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q))
          return false
      }
      if (pubFilter === 'published' && !p.is_published) return false
      if (pubFilter === 'draft' && p.is_published) return false
      return true
    })
  }, [projects, search, pubFilter])

  const togglePublish = async (project: Project) => {
    const supabase = createClient()
    const newVal = !project.is_published
    const { error } = await supabase
      .from('projects')
      .update({ is_published: newVal })
      .eq('id', project.id)

    if (!error) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_published: newVal } : p
        )
      )
    }
  }

  return (
    <div className="mt-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Search title or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex rounded-lg border border-stone-200 bg-white p-0.5">
          {(['all', 'published', 'draft'] as const).map((val) => (
            <button
              key={val}
              onClick={() => setPubFilter(val)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                pubFilter === val
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              )}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-500">Title</th>
              <th className="px-4 py-3 font-medium text-stone-500">City</th>
              <th className="px-4 py-3 font-medium text-stone-500">Type</th>
              <th className="px-4 py-3 font-medium text-stone-500">Style</th>
              <th className="px-4 py-3 font-medium text-stone-500">Status</th>
              <th className="px-4 py-3 font-medium text-stone-500">Updated</th>
              <th className="px-4 py-3 font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((project) => (
              <tr key={project.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600">{project.city}</td>
                <td className="px-4 py-3 text-stone-600">{project.property_type}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.style_tags.map((tag) => (
                      <Badge key={tag} variant="warm">{tag}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublish(project)}
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer',
                      project.is_published
                        ? 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    )}
                  >
                    {project.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {formatDate(project.updated_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900"
                    >
                      Edit
                    </Link>
                    {project.is_published && (
                      <Link
                        href={`/portfolio/${project.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-stone-400 hover:text-stone-700"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
