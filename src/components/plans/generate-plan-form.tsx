'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STYLE_OPTIONS, CURRENCY_OPTIONS } from '@/lib/constants'

export function GeneratePlanForm({ floorId, propertyId }: { floorId: string; propertyId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Modern'])
  const [budgetLimit, setBudgetLimit] = useState<string>('')
  const [currency, setCurrency] = useState('USD')

  const toggleStyle = (style: string) =>
    setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorId,
          stylePreferences: selectedStyles,
          budgetLimit: budgetLimit ? Number(budgetLimit) : null,
          currency,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate plans')
        setLoading(false)
        return
      }

      // Navigate to first generated plan
      if (data.planIds && data.planIds.length > 0) {
        router.push(`/properties/${propertyId}/plans/${data.planIds[0]}`)
      } else {
        router.push(`/properties/${propertyId}/floors/${floorId}`)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Style Preferences
          <span className="ml-1 text-xs font-normal text-gray-400">(select one or more)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map(style => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedStyles.includes(style)
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Total Budget
          <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
        </label>
        <div className="flex gap-3">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {CURRENCY_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="number"
            value={budgetLimit}
            onChange={e => setBudgetLimit(e.target.value)}
            min={0}
            placeholder="e.g. 3000 (leave empty for no limit)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || selectedStyles.length === 0}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating layout plans with Claude AI...
          </span>
        ) : (
          '✨ Generate Layout Plans'
        )}
      </button>

      {loading && (
        <p className="text-center text-xs text-gray-400">
          This usually takes 10–20 seconds. Claude AI is analyzing your rooms and selecting furniture...
        </p>
      )}
    </form>
  )
}
