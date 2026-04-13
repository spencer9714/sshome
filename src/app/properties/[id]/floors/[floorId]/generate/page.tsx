import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { GeneratePlanForm } from '@/components/plans/generate-plan-form'

export default async function GeneratePlanPage({
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
    .select('id, name, width_cm, depth_cm')
    .eq('floor_id', floorId)

  if (!rooms || rooms.length === 0) redirect(`/properties/${id}/floors/${floorId}`)

  const propertyName = (floor.properties as { name: string }).name

  return (
    <div className="p-8 max-w-2xl">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-900">Properties</Link>
        <span>/</span>
        <Link href={`/properties/${id}`} className="hover:text-gray-900">{propertyName}</Link>
        <span>/</span>
        <Link href={`/properties/${id}/floors/${floorId}`} className="hover:text-gray-900">Floor {floor.floor_number}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Generate Plan</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Generate AI Layout Plan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set your style and budget. Claude AI will generate 2 complete layout plans for your {rooms.length} room{rooms.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Rooms summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Rooms to furnish</p>
        <div className="flex flex-wrap gap-2">
          {(rooms as { id: string; name: string; width_cm: number; depth_cm: number }[]).map(room => (
            <span key={room.id} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-sm text-gray-700">
              {room.name} ({(room.width_cm / 100).toFixed(1)}×{(room.depth_cm / 100).toFixed(1)}m)
            </span>
          ))}
        </div>
      </div>

      <GeneratePlanForm floorId={floorId} propertyId={id} />
    </div>
  )
}
