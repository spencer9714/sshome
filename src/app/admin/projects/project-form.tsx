'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { slugify } from '@/lib/utils'
import {
  PROPERTY_TYPES,
  STYLE_OPTIONS,
  BUDGET_RANGES,
  GOAL_OPTIONS,
} from '@/lib/constants'
import type { Project } from '@/lib/types/database'

interface ProjectFormProps {
  project?: Project
  onSubmit: (formData: FormData) => Promise<void>
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(!!project)
  const [styleTags, setStyleTags] = useState<string[]>(project?.style_tags ?? [])
  const [loading, setLoading] = useState(false)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugEdited) {
      setSlug(slugify(val))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await onSubmit(formData)
    } catch {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="title"
          name="title"
          label="Title *"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Japandi Condo in Mountain View"
        />
        <div>
          <Input
            id="slug"
            name="slug"
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            placeholder="japandi-condo-mountain-view"
          />
          <p className="mt-1 text-xs text-stone-400">Auto-generated from title. Edit if needed.</p>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          id="city"
          name="city"
          label="City *"
          required
          defaultValue={project?.city}
          placeholder="Mountain View"
        />
        <Input
          id="bedrooms"
          name="bedrooms"
          type="number"
          label="Bedrooms"
          min={0}
          defaultValue={project?.bedrooms ?? undefined}
        />
        <Input
          id="bathrooms"
          name="bathrooms"
          type="number"
          label="Bathrooms"
          min={0}
          step={0.5}
          defaultValue={project?.bathrooms ?? undefined}
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Property Type *</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="property_type"
                value={type}
                defaultChecked={project?.property_type === type}
                className="peer sr-only"
                required
              />
              <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Style Tags */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Style Tags</label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <label key={style} className="flex items-center">
              <input
                type="checkbox"
                name="style_tags"
                value={style}
                checked={styleTags.includes(style)}
                onChange={() => {
                  setStyleTags((prev) =>
                    prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
                  )
                }}
                className="sr-only peer"
              />
              <span className="cursor-pointer rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white">
                {style}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget / Goal / Timeline */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Budget Range</label>
          <select
            name="budget_range"
            defaultValue={project?.budget_range ?? ''}
            className="block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Select...</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Goal</label>
          <select
            name="goal"
            defaultValue={project?.goal ?? ''}
            className="block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Select...</option>
            {GOAL_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <Input
          id="timeline_weeks"
          name="timeline_weeks"
          type="number"
          label="Timeline (weeks)"
          min={1}
          defaultValue={project?.timeline_weeks ?? undefined}
        />
      </div>

      {/* Text fields */}
      <Textarea
        id="summary"
        name="summary"
        label="Summary"
        defaultValue={project?.summary ?? ''}
        placeholder="A brief description of the project..."
        rows={2}
      />
      <Textarea
        id="what_we_did"
        name="what_we_did"
        label="What We Did"
        defaultValue={project?.what_we_did ?? ''}
        placeholder="Describe the scope of work..."
        rows={4}
      />
      <Textarea
        id="design_notes"
        name="design_notes"
        label="Design Decisions"
        defaultValue={project?.design_notes ?? ''}
        placeholder="STR-specific design reasoning..."
        rows={4}
      />

      {/* Published toggle (only on edit) */}
      {project && (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="hidden"
              name="is_published"
              value={project.is_published ? 'true' : 'false'}
            />
            <input
              type="checkbox"
              defaultChecked={project.is_published}
              onChange={(e) => {
                const hidden = e.target.previousElementSibling as HTMLInputElement
                hidden.value = e.target.checked ? 'true' : 'false'
              }}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-stone-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sage-500 peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm font-medium text-stone-700">Published</span>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading}>
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
