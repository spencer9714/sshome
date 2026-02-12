import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { LeadDetail } from './lead-detail'
import type { Lead } from '@/lib/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: leadData } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  const lead = leadData as Lead | null
  if (!lead) notFound()

  return (
    <div>
      <Link
        href="/admin/leads"
        className="text-sm text-stone-500 hover:text-stone-900"
      >
        &larr; Back to Leads
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">{lead.name}</h1>
      <p className="mt-1 text-sm text-stone-500">{lead.email}</p>

      <LeadDetail lead={lead} />
    </div>
  )
}
