import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { FURNITURE_CATEGORY_LABELS } from '@/lib/constants'

export default async function CatalogPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  const { data: items } = await supabase
    .from('furniture_items')
    .select('*, providers(name)')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('price', { ascending: true })

  const categories = [...new Set((items ?? []).map(i => i.category))].sort()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar userEmail={user.email!} isAdmin={profile?.role === 'admin'} />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Furniture Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">{items?.length ?? 0} items available for your layout plans</p>
        </div>

        {categories.map(category => {
          const categoryItems = (items ?? []).filter(i => i.category === category)
          return (
            <div key={category} className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {FURNITURE_CATEGORY_LABELS[category] ?? category}
                <span className="ml-2 text-sm font-normal text-gray-400">{categoryItems.length} items</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                        🛋️
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(item.width_cm / 100).toFixed(1)}m × {(item.depth_cm / 100).toFixed(1)}m
                      {item.providers?.name ? ` · ${item.providers.name}` : ''}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">
                        {item.currency} ${item.price.toLocaleString()}
                      </span>
                      {item.product_url && (
                        <a href={item.product_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline">View ↗</a>
                      )}
                    </div>
                    {item.style_tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.style_tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {(!items || items.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🛋️</div>
            <p className="text-lg font-medium">No furniture items yet</p>
            <p className="text-sm mt-1">Ask your admin to add furniture to the catalog</p>
          </div>
        )}
      </main>
    </div>
  )
}
