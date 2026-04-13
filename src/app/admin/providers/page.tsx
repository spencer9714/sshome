import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProvidersManager } from '@/components/providers/providers-manager'

export default async function AdminProvidersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .order('name')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Furniture Providers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage furniture suppliers (IKEA, Wayfair, Amazon, custom)</p>
      </div>
      <ProvidersManager providers={providers ?? []} />
    </div>
  )
}
