'use client'

import { useState, useMemo } from 'react'
import { ProjectCard } from '@/components/portfolio/project-card'
import { FilterChips } from '@/components/ui/filter-chips'
import { Input } from '@/components/ui/input'
import { PROPERTY_TYPES, STYLE_OPTIONS, BUDGET_RANGES, GOAL_OPTIONS } from '@/lib/constants'
import type { Project } from '@/lib/types/database'

interface PortfolioGridProps {
  projects: Project[]
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [budget, setBudget] = useState<string | null>(null)
  const [goal, setGoal] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q)
        )
          return false
      }
      if (propertyType && p.property_type !== propertyType) return false
      if (style && !p.style_tags.includes(style)) return false
      if (budget && p.budget_range !== budget) return false
      if (goal && p.goal !== goal) return false
      return true
    })
  }, [projects, search, propertyType, style, budget, goal])

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Search */}
      <div className="mb-8">
        <Input
          placeholder="Search by title or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Filters */}
      <div className="mb-10 space-y-4">
        <FilterChips
          label="Property Type"
          options={PROPERTY_TYPES}
          selected={propertyType}
          onChange={setPropertyType}
        />
        <FilterChips
          label="Style"
          options={STYLE_OPTIONS}
          selected={style}
          onChange={setStyle}
        />
        <FilterChips
          label="Budget Range"
          options={BUDGET_RANGES}
          selected={budget}
          onChange={setBudget}
        />
        <FilterChips
          label="Goal"
          options={GOAL_OPTIONS}
          selected={goal}
          onChange={setGoal}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-stone-400">No projects match your filters.</p>
          <button
            onClick={() => {
              setSearch('')
              setPropertyType(null)
              setStyle(null)
              setBudget(null)
              setGoal(null)
            }}
            className="mt-3 text-sm font-medium text-stone-600 underline hover:text-stone-900"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  )
}
