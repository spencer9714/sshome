import { createServerSupabaseClient } from '@/lib/supabase/server'
import { LeadsList } from './leads-list'
import type { Lead } from '@/lib/types/database'

export default async function AdminLeadsPage() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const leads = (data ?? []) as Lead[]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Leads</h1>
      <p className="mt-1 text-sm text-stone-500">
        Manage incoming quote requests.
      </p>

      <LeadsList leads={leads} />
    </div>
  )
}
