import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PlanView } from '@/components/plans/plan-view'

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>
}) {
  const { id, planId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch plan — includes floor_id directly
  const { data: plan } = await supabase
    .from('layout_plans')
    .select('*, floors!inner(id, floor_number, property_id, total_width_cm, total_depth_cm, floor_plan_image_path, properties!inner(name, user_id))')
    .eq('id', planId)
    .single()

  if (!plan) notFound()

  const floor = plan.floors as { id: string; floor_number: number; property_id: string; total_width_cm: number | null; total_depth_cm: number | null; floor_plan_image_path: string | null; properties: { name: string; user_id: string } }
  if (floor.properties.user_id !== user.id) notFound()
  if (floor.property_id !== id) notFound()

  const floorId = floor.id

  // Fetch rooms using floor_id from the plan
  const { data: roomsData } = await supabase
    .from('rooms')
    .select('*')
    .eq('floor_id', floorId)
    .order('created_at', { ascending: true })

  // Fetch plan items with furniture details
  const { data: planItems } = await supabase
    .from('plan_items')
    .select('*, furniture_items(name, category, width_cm, depth_cm, price, currency, product_url, image_url)')
    .eq('plan_id', planId)

  // Generate signed URL for background image
  const backgroundImageUrl = floor.floor_plan_image_path
    ? (await supabase.storage.from('floor-plans').createSignedUrl(floor.floor_plan_image_path, 3600)).data?.signedUrl ?? null
    : null

  // Other plans on same floor
  const { data: otherPlans } = await supabase
    .from('layout_plans')
    .select('id, name, total_price, currency')
    .eq('floor_id', floorId)
    .neq('id', planId)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-900">Properties</Link>
        <span>/</span>
        <Link href={`/properties/${id}`} className="hover:text-gray-900">{floor.properties.name}</Link>
        <span>/</span>
        <Link href={`/properties/${id}/floors/${floorId}`} className="hover:text-gray-900">Floor {floor.floor_number}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{plan.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{plan.name}</h1>
          {plan.total_price && (
            <p className="mt-1 text-lg font-semibold text-green-600">
              Total: {plan.currency} ${(plan.total_price as number).toLocaleString()}
            </p>
          )}
        </div>
        {otherPlans && otherPlans.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Other plans:</span>
            {(otherPlans as { id: string; name: string }[]).map(p => (
              <Link key={p.id} href={`/properties/${id}/plans/${p.id}`}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors">
                {p.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <PlanView
        plan={plan as { id: string; name: string; total_price: number | null; currency: string; ai_reasoning: string | null; style_preferences: string[] }}
        backgroundImageUrl={backgroundImageUrl ?? undefined}
        totalWidthCm={floor.total_width_cm ?? undefined}
        totalDepthCm={floor.total_depth_cm ?? undefined}
        rooms={(roomsData ?? []) as {
          id: string; name: string; width_cm: number; depth_cm: number
          position_x: number; position_y: number
          doors: { x: number; y: number; width: number; wall: string }[] | null
          windows: { x: number; y: number; width: number; wall: string }[] | null
        }[]}
        planItems={(planItems ?? []) as {
          id: string; room_id: string; furniture_item_id: string
          position_x: number; position_y: number; rotation: number; quantity: number
          furniture_items: { name: string; category: string; width_cm: number; depth_cm: number; price: number; currency: string; product_url: string | null; image_url: string | null }
        }[]}
        propertyId={id}
        floorId={floorId}
      />
    </div>
  )
}
