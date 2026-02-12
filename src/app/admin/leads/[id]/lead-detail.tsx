'use client'

import { useState } from 'react'
import { updateLeadStatus, updateLeadNotes, toggleLeadArchive } from '../actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LEAD_STATUS_OPTIONS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import type { Lead } from '@/lib/types/database'

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-purple-100 text-purple-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-stone-100 text-stone-500',
}

export function LeadDetail({ lead: initialLead }: { lead: Lead }) {
  const [lead, setLead] = useState(initialLead)
  const [notes, setNotes] = useState(lead.internal_notes ?? '')
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (status: string) => {
    await updateLeadStatus(lead.id, status)
    setLead((prev) => ({ ...prev, internal_status: status }))
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    await updateLeadNotes(lead.id, notes)
    setSaving(false)
  }

  const handleArchive = async () => {
    await toggleLeadArchive(lead.id, !lead.archived)
    setLead((prev) => ({ ...prev, archived: !prev.archived }))
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Lead Info */}
      <div className="lg:col-span-2 space-y-8">
        {/* Contact */}
        <Card title="Contact Information">
          <InfoRow label="Name" value={lead.name} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="Phone" value={lead.phone} />
          <InfoRow label="Submitted" value={formatDate(lead.created_at)} />
        </Card>

        {/* Property */}
        <Card title="Property Details">
          <InfoRow label="City" value={lead.city} />
          <InfoRow label="Property Type" value={lead.property_type} />
          <InfoRow label="Bedrooms" value={lead.bedrooms?.toString()} />
          <InfoRow label="Bathrooms" value={lead.bathrooms?.toString()} />
          <InfoRow label="Current Status" value={lead.current_status} />
        </Card>

        {/* Style & Goals */}
        <Card title="Style & Goals">
          <InfoRow label="Target Guests">
            <div className="flex flex-wrap gap-1">
              {lead.target_guests.map((g) => (
                <Badge key={g}>{g}</Badge>
              ))}
              {lead.target_guests.length === 0 && <span className="text-stone-400">-</span>}
            </div>
          </InfoRow>
          <InfoRow label="Style Preferences">
            <div className="flex flex-wrap gap-1">
              {lead.style_preferences.map((s) => (
                <Badge key={s} variant="warm">{s}</Badge>
              ))}
              {lead.style_preferences.length === 0 && <span className="text-stone-400">-</span>}
            </div>
          </InfoRow>
        </Card>

        {/* Budget & Timeline */}
        <Card title="Budget & Timeline">
          <InfoRow label="Timeline" value={lead.timeline} />
          <InfoRow label="Furnishing Budget" value={lead.budget_furnishing_range} />
          <InfoRow label="Service Budget" value={lead.budget_service_range} />
        </Card>

        {/* Scope */}
        <Card title="Scope & Details">
          <InfoRow label="Scope">
            <div className="flex flex-wrap gap-1">
              {lead.scope.map((s) => (
                <Badge key={s} variant="sage">{s}</Badge>
              ))}
              {lead.scope.length === 0 && <span className="text-stone-400">-</span>}
            </div>
          </InfoRow>
          <InfoRow label="Links">
            {lead.links.length > 0 ? (
              <ul className="space-y-1">
                {lead.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-stone-400">-</span>
            )}
          </InfoRow>
          {lead.notes && (
            <InfoRow label="Notes">
              <p className="text-sm text-stone-600 whitespace-pre-line">{lead.notes}</p>
            </InfoRow>
          )}
        </Card>
      </div>

      {/* Sidebar: Status & Internal Notes */}
      <div className="space-y-6">
        <Card title="Status">
          <div className="flex flex-wrap gap-2">
            {LEAD_STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  lead.internal_status === status
                    ? statusColors[status]
                    : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Internal Notes">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Add internal notes..."
          />
          <Button
            onClick={handleSaveNotes}
            loading={saving}
            size="sm"
            className="mt-3"
          >
            Save Notes
          </Button>
        </Card>

        <Card title="Actions">
          <Button
            onClick={handleArchive}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {lead.archived ? 'Unarchive' : 'Archive Lead'}
          </Button>
        </Card>
      </div>
    </div>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-400">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string | null
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="text-sm font-medium text-stone-500 sm:w-36 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-stone-900">
        {children || value || <span className="text-stone-400">-</span>}
      </dd>
    </div>
  )
}
