import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NewPropertyButton } from '@/components/properties/new-property-button'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: properties } = await supabase
    .from('properties')
    .select('*, floors(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your Airbnb properties and layout plans</p>
        </div>
        <NewPropertyButton />
      </div>

      {!properties || properties.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-gray-900">No properties yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Add your first Airbnb property to start generating AI-powered furniture layout plans.
          </p>
          <NewPropertyButton className="mt-6 inline-flex" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(properties as { id: string; name: string; address: string | null; created_at: string }[]).map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">🏠</div>
                <span className="text-xs text-gray-400">
                  {new Date(property.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
              {property.address && (
                <p className="mt-1 text-sm text-gray-500 truncate">{property.address}</p>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <span>→ View floors & plans</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
