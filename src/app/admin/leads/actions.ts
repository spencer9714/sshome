'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('leads')
    .update({ internal_status: status })
    .eq('id', leadId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
}

export async function updateLeadNotes(leadId: string, notes: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('leads')
    .update({ internal_notes: notes })
    .eq('id', leadId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${leadId}`)
}

export async function toggleLeadArchive(leadId: string, archived: boolean) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('leads')
    .update({ archived })
    .eq('id', leadId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
}
