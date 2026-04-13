import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateLayoutPlans } from '@/lib/claude/generate-layout'

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
      return NextResponse.json({ error: 'No rooms found for this floor' }, { status: 400 })
    }

    // Get matching furniture (filter by style tags if provided)
    let furnitureQuery = supabase
      .from('furniture_items')
      .select('*')
      .eq('is_active', true)

    if (budgetLimit) {
      // Rough per-item budget filter (budget / estimated 5 items per room)
      const maxItemPrice = budgetLimit * 0.4
      furnitureQuery = furnitureQuery.lte('price', maxItemPrice)
    }

    const { data: allFurniture } = await furnitureQuery

    // Filter by style if preferences given
    let availableFurniture = allFurniture ?? []
    if (stylePreferences.length > 0) {
      const styleFurniture = availableFurniture.filter(f =>
        f.style_tags.some((tag: string) => stylePreferences.map(s => s.toLowerCase()).includes(tag.toLowerCase()))
      )
      // Fall back to all furniture if style filtering returns too few items
      if (styleFurniture.length >= 5) availableFurniture = styleFurniture
    }

    if (availableFurniture.length === 0) {
      return NextResponse.json({ error: 'No furniture items available in catalog. Please add furniture first.' }, { status: 400 })
    }

    // Generate plans with Claude
    const plans = await generateLayoutPlans(
      rooms as Parameters<typeof generateLayoutPlans>[0],
      availableFurniture.map(f => ({
        id: f.id,
        name: f.name,
        category: f.category,
        width_cm: f.width_cm,
        depth_cm: f.depth_cm,
        price: f.price,
        currency: f.currency,
        style_tags: f.style_tags,
      })),
      stylePreferences,
      budgetLimit,
      currency
    )

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

      // Save plan items
      const planItems = plan.rooms.flatMap(room =>
        room.furniture.map(item => ({
          plan_id: savedPlan.id,
          room_id: room.room_id,
          furniture_item_id: item.furniture_item_id,
          position_x: item.position_x,
          position_y: item.position_y,
          rotation: item.rotation,
          quantity: item.quantity,
        }))
      )

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
