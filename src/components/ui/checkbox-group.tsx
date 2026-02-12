'use client'

import { cn } from '@/lib/utils'

interface CheckboxGroupProps {
  label?: string
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  columns?: 2 | 3
}

export function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  columns = 2,
}: CheckboxGroupProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <fieldset className="space-y-2">
      {label && (
        <legend className="block text-sm font-medium text-stone-700">{label}</legend>
      )}
      <div
        className={cn(
          'grid gap-2',
          columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors',
              selected.includes(option)
                ? 'border-stone-900 bg-stone-50 text-stone-900'
                : 'border-stone-200 text-stone-600 hover:border-stone-300'
            )}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
