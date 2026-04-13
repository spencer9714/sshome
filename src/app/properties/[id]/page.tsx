import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { AddFloorButton } from '@/components/floors/add-floor-button'
import { DeletePropertyButton } from '@/components/properties/delete-property-button'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!property) notFound()

  const { data: floors } = await supabase
    .from('floors')
    .select('*, rooms(count), layout_plans(count)')
    .eq('property_id', id)
    .order('floor_number', { ascending: true })

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-900">Properties</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{property.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          {property.address && <p className="mt-1 text-sm text-gray-500">{property.address}</p>}
        </div>
        <div className="flex items-center gap-2">
          <DeletePropertyButton propertyId={id} propertyName={property.name} />
          <AddFloorButton propertyId={id} nextFloorNumber={(floors?.length ?? 0) + 1} />
        </div>
      </div>

      {/* Floors */}
      {!floors || floors.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">🏗️</div>
          <h3 className="text-lg font-semibold text-gray-900">No floors yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Add your first floor to start defining rooms and generating layout plans.
          </p>
          <AddFloorButton propertyId={id} nextFloorNumber={1} className="mt-6 inline-flex" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(floors as { id: string; floor_number: number; floor_plan_image_path: string | null }[]).map((floor) => (
            <Link
              key={floor.id}
              href={`/properties/${id}/floors/${floor.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">
                  {floor.floor_number === 1 ? '1️⃣' : floor.floor_number === 2 ? '2️⃣' : `${floor.floor_number}F`}
                </span>
                {floor.floor_plan_image_path && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Floor plan uploaded</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Floor {floor.floor_number}
              </h3>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>→ Manage rooms & plans</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
