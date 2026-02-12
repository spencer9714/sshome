'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LEAD_STATUS_OPTIONS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import type { Lead } from '@/lib/types/database'

interface LeadsListProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-purple-100 text-purple-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-stone-100 text-stone-500',
}

export function LeadsList({ leads }: LeadsListProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (!showArchived && l.archived) return false
      if (showArchived && !l.archived) return false
      if (statusFilter && l.internal_status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.email.toLowerCase().includes(q) &&
          !(l.city?.toLowerCase().includes(q))
        )
          return false
      }
      return true
    })
  }, [leads, statusFilter, showArchived, search])

  return (
    <div className="mt-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Search name, email, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex rounded-lg border border-stone-200 bg-white p-0.5">
          <button
            onClick={() => setStatusFilter(null)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              statusFilter === null
                ? 'bg-stone-900 text-white'
                : 'text-stone-500 hover:text-stone-900'
            )}
          >
            All
          </button>
          {LEAD_STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                statusFilter === status
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            showArchived
              ? 'border-stone-900 bg-stone-900 text-white'
              : 'border-stone-200 text-stone-500 hover:text-stone-900'
          )}
        >
          {showArchived ? 'Viewing Archived' : 'Show Archived'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-500">Name</th>
              <th className="px-4 py-3 font-medium text-stone-500">Email</th>
              <th className="px-4 py-3 font-medium text-stone-500">City</th>
              <th className="px-4 py-3 font-medium text-stone-500">Type</th>
              <th className="px-4 py-3 font-medium text-stone-500">Status</th>
              <th className="px-4 py-3 font-medium text-stone-500">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    {lead.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600">{lead.email}</td>
                <td className="px-4 py-3 text-stone-600">{lead.city || '-'}</td>
                <td className="px-4 py-3 text-stone-600">{lead.property_type || '-'}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      statusColors[lead.internal_status] || 'bg-stone-100 text-stone-600'
                    )}
                  >
                    {lead.internal_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
