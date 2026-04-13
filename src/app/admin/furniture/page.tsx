import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AddFurnitureButton } from '@/components/furniture/add-furniture-button'
import { FurnitureTable } from '@/components/furniture/furniture-table'
import { FURNITURE_CATEGORY_LABELS } from '@/lib/constants'

export default async function AdminFurniturePage() {
  const supabase = await createServerSupabaseClient()

  const { data: items } = await supabase
    .from('furniture_items')
    .select('*, providers(name)')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  const { data: providers } = await supabase
    .from('providers')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Furniture Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">{items?.length ?? 0} items across {Object.keys(FURNITURE_CATEGORY_LABELS).length} categories</p>
        </div>
        <AddFurnitureButton providers={providers ?? []} />
      </div>

      <FurnitureTable items={items ?? []} providers={providers ?? []} />
    </div>
  )
}
