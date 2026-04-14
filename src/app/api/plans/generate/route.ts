import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateLayoutPlans, buildSearchUrl } from '@/lib/claude/generate-layout'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { floorId, stylePreferences, budgetLimit, currency } = body as {
      floorId: string
      stylePreferences: string[]
      budgetLimit: number | null
      currency: string
    }

    // Verify floor belongs to user
    const { data: floor } = await supabase
      .from('floors')
      .select('*, properties!inner(user_id)')
      .eq('id', floorId)
      .single()

    if (!floor || (floor.properties as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: 'Floor not found' }, { status: 404 })
    }

    // Get rooms
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*')
      .eq('floor_id', floorId)

    if (!rooms || rooms.length === 0) {
      return NextResponse.json({ error: 'No rooms found. Add rooms first.' }, { status: 400 })
    }

    // Generate plans — Claude suggests its own furniture
    const plans = await generateLayoutPlans(
      rooms as Parameters<typeof generateLayoutPlans>[0],
      stylePreferences,
      budgetLimit,
      currency
    )

    // Ensure "AI Suggested" provider exists
    let { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('name', 'AI Suggested')
      .single()

    if (!provider) {
      const { data: newProvider } = await supabase
        .from('providers')
        .insert({ name: 'AI Suggested', website: 'https://www.ikea.com', is_active: true })
        .select()
        .single()
      provider = newProvider
    }

    if (!provider) {
      return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 })
    }

    const providerId = provider.id

    // Save plans to database
    const savedPlanIds: string[] = []

    for (const plan of plans) {
      const { data: savedPlan, error: planError } = await supabase
        .from('layout_plans')
        .insert({
          floor_id: floorId,
          name: plan.name,
          style_preferences: stylePreferences,
          budget_limit: budgetLimit,
          currency,
          total_price: plan.total_price,
          ai_reasoning: plan.reasoning,
        })
        .select()
        .single()

      if (planError || !savedPlan) continue
      savedPlanIds.push(savedPlan.id)

      // Save each furniture item and plan_item
      const planItems = []

      for (const room of plan.rooms) {
        for (const placement of room.furniture) {
          const f = placement.item

          // Upsert furniture item (match by name to avoid duplicates)
          let { data: existingItem } = await supabase
            .from('furniture_items')
            .select('id')
            .eq('name', f.name)
            .single()

          if (!existingItem) {
            const { data: newItem } = await supabase
              .from('furniture_items')
              .insert({
                provider_id: providerId,
                name: f.name,
                category: f.category,
                width_cm: f.width_cm,
                depth_cm: f.depth_cm,
                height_cm: f.height_cm,
                price: f.price,
                currency: f.currency,
                product_url: buildSearchUrl(f.name),
                style_tags: f.style_tags,
                is_active: true,
              })
              .select()
              .single()
            existingItem = newItem
          }

          if (!existingItem) continue

          // Clamp position within room bounds
          const roomData = (rooms as { id: string; width_cm: number; depth_cm: number }[]).find(r => r.id === room.room_id)
          const clampedX = roomData
            ? Math.max(0, Math.min(placement.position_x, roomData.width_cm - f.width_cm))
            : Math.max(0, placement.position_x)
          const clampedY = roomData
            ? Math.max(0, Math.min(placement.position_y, roomData.depth_cm - f.depth_cm))
            : Math.max(0, placement.position_y)

          planItems.push({
            plan_id: savedPlan.id,
            room_id: room.room_id,
            furniture_item_id: existingItem.id,
            position_x: clampedX,
            position_y: clampedY,
            rotation: placement.rotation,
            quantity: placement.quantity,
          })
        }
      }

      if (planItems.length > 0) {
        await supabase.from('plan_items').insert(planItems)
      }
    }

    return NextResponse.json({ planIds: savedPlanIds })
  } catch (error) {
    console.error('Layout generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate layout plans' },
      { status: 500 }
    )
  }
}
