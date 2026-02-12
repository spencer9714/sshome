'use client'

import { cn } from '@/lib/utils'

interface FilterChipsProps {
  label: string
  options: readonly string[]
  selected: string | null
  onChange: (value: string | null) => void
}

export function FilterChips({ label, options, selected, onChange }: FilterChipsProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium uppercase tracking-wider text-stone-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange(null)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            selected === null
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          )}
        >
          All
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(selected === option ? null : option)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              selected === option
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
