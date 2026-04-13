import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { AddRoomButton } from '@/components/rooms/add-room-button'
import { RoomCard } from '@/components/rooms/room-card'
import { DeleteFloorButton } from '@/components/floors/delete-floor-button'

export default async function FloorPage({
  params,
}: {
  params: Promise<{ id: string; floorId: string }>
}) {
  const { id, floorId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: floor } = await supabase
    .from('floors')
    .select('*, properties!inner(name, user_id)')
    .eq('id', floorId)
    .single()

  if (!floor || (floor.properties as { user_id: string }).user_id !== user.id) notFound()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('floor_id', floorId)
    .order('created_at', { ascending: true })

  const { data: plans } = await supabase
    .from('layout_plans')
    .select('*')
    .eq('floor_id', floorId)
    .order('created_at', { ascending: false })

  const propertyName = (floor.properties as { name: string }).name

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-900">Properties</Link>
        <span>/</span>
        <Link href={`/properties/${id}`} className="hover:text-gray-900">{propertyName}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Floor {floor.floor_number}</span>
      </nav>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Floor {floor.floor_number}</h1>
          <p className="mt-1 text-sm text-gray-500">{propertyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteFloorButton floorId={floorId} propertyId={id} />
          <AddRoomButton floorId={floorId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rooms Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
            <span className="text-sm text-gray-400">{rooms?.length ?? 0} rooms</span>
          </div>

          {!rooms || rooms.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">🛋️</div>
              <h3 className="font-semibold text-gray-900">No rooms yet</h3>
              <p className="mt-1 text-sm text-gray-500">Add rooms to define your floor layout</p>
              <AddRoomButton floorId={floorId} className="mt-4 inline-flex" />
            </div>
          ) : (
            <div className="space-y-3">
              {(rooms as {
                id: string
                name: string
                width_cm: number
                depth_cm: number
                doors: unknown[]
                windows: unknown[]
              }[]).map((room) => (
                <RoomCard key={room.id} room={room} floorId={floorId} />
              ))}
            </div>
          )}
        </div>

        {/* Plans Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Layout Plans</h2>
          </div>

          {rooms && rooms.length > 0 ? (
            <>
              <Link
                href={`/properties/${id}/floors/${floorId}/generate`}
                className="block w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-6 text-center hover:border-blue-400 hover:bg-blue-100 transition-all"
              >
                <div className="text-3xl mb-2">✨</div>
                <p className="font-semibold text-blue-700">Generate AI Layout Plan</p>
                <p className="mt-1 text-xs text-blue-500">Set style & budget → AI generates plans</p>
              </Link>

              {plans && plans.length > 0 && (
                <div className="mt-4 space-y-3">
                  {(plans as { id: string; name: string; total_price: number | null; currency: string }[]).map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/properties/${id}/plans/${plan.id}`}
                      className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <p className="font-medium text-gray-900 text-sm">{plan.name}</p>
                      {plan.total_price && (
                        <p className="mt-1 text-sm text-green-600 font-semibold">
                          {plan.currency} ${plan.total_price.toLocaleString()}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-400">Add rooms first to generate layout plans</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
