import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { DeleteFloorButton } from '@/components/floors/delete-floor-button'
import { UploadFloorPlanButton } from '@/components/rooms/upload-floor-plan-button'
import { FloorEditorClient } from './floor-editor-client'
import type { FloorRecord } from '@/components/canvas/floor-plan-editor'
import type { RoomShape } from '@/lib/planner/adapter'
import type { FloorPlanData } from '@robinweitzel/floor-planner'

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

  // Get signed URL for the background image (valid 1 hour).
  // Use service role to bypass RLS — storage path is floors/{floorId}/plan.* which
  // doesn't match the user-folder SELECT policy (expects {userId}/...).
  let bgImageUrl: string | null = null
  if (floor.floor_plan_image_path) {
    const serviceClient = await createServiceRoleClient()
    const { data: signed } = await serviceClient.storage
      .from('floor-plans')
      .createSignedUrl(floor.floor_plan_image_path, 3600)
    bgImageUrl = signed?.signedUrl ?? null
  }

  const floorRecord: FloorRecord = {
    id: floor.id,
    floor_plan_image_url: bgImageUrl,
    total_width_cm: floor.total_width_cm ?? undefined,
    total_depth_cm: floor.total_depth_cm ?? undefined,
    scale_px_per_cm: (floor as Record<string, unknown>).scale_px_per_cm as number ?? undefined,
    calib_offset_x: (floor as Record<string, unknown>).calib_offset_x as number ?? 0,
    calib_offset_y: (floor as Record<string, unknown>).calib_offset_y as number ?? 0,
    planner_state: (floor as Record<string, unknown>).planner_state as FloorPlanData ?? null,
  }

  const initialRooms: RoomShape[] = (rooms ?? []).map(r => ({
    id: r.id,
    name: r.name,
    width_cm: r.width_cm,
    depth_cm: r.depth_cm,
    position_x: r.position_x ?? 0,
    position_y: r.position_y ?? 0,
    doors: (r.doors as RoomShape['doors']) ?? [],
    windows: (r.windows as RoomShape['windows']) ?? [],
  }))

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-900">Properties</Link>
        <span>/</span>
        <Link href={`/properties/${id}`} className="hover:text-gray-900">{propertyName}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Floor {floor.floor_number}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Floor {floor.floor_number}</h1>
          <p className="mt-1 text-sm text-gray-500">{propertyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteFloorButton floorId={floorId} propertyId={id} />
          <UploadFloorPlanButton floorId={floorId} />
          {rooms && rooms.length > 0 && (
            <Link
              href={`/properties/${id}/floors/${floorId}/generate`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              ✨ AI Layout
            </Link>
          )}
        </div>
      </div>

      {/* Interactive floor plan editor */}
      <FloorEditorClient
        floor={floorRecord}
        initialRooms={initialRooms}
        propertyId={id}
      />

      {/* Plans list */}
      {plans && plans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Layout Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(plans as { id: string; name: string; total_price: number | null; currency: string }[]).map(plan => (
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
        </div>
      )}
    </div>
  )
}
