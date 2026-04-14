'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FloorPlanCanvas } from '@/components/canvas/floor-plan-canvas'
import { FURNITURE_CATEGORY_LABELS } from '@/lib/constants'

interface Room {
  id: string; name: string; width_cm: number; depth_cm: number
  position_x: number; position_y: number
  doors: { x: number; y: number; width: number; wall: string }[] | null
  windows: { x: number; y: number; width: number; wall: string }[] | null
}

interface PlanItem {
  id: string; room_id: string; furniture_item_id: string
  position_x: number; position_y: number; rotation: number; quantity: number
  furniture_items: {
    name: string; category: string; width_cm: number; depth_cm: number
    price: number; currency: string; product_url: string | null; image_url: string | null
  }
}

interface Plan {
  id: string; name: string; total_price: number | null; currency: string
  ai_reasoning: string | null; style_preferences: string[]
}

interface PlanViewProps {
  plan: Plan
  rooms: Room[]
  planItems: PlanItem[]
  propertyId: string
  floorId: string
  backgroundImageUrl?: string
  totalWidthCm?: number
  totalDepthCm?: number
}

export function PlanView({ plan, rooms, planItems, propertyId, floorId, backgroundImageUrl, totalWidthCm, totalDepthCm }: PlanViewProps) {
  const router = useRouter()
  const [items, setItems] = useState(planItems)
  const [saving, setSaving] = useState(false)

  const canvasItems = items.map(item => ({
    id: item.id,
    room_id: item.room_id,
    furniture_item_id: item.furniture_item_id,
    furniture_name: item.furniture_items.name,
    furniture_category: item.furniture_items.category,
    width_cm: item.furniture_items.width_cm,
    depth_cm: item.furniture_items.depth_cm,
    position_x: item.position_x,
    position_y: item.position_y,
    rotation: item.rotation,
    quantity: item.quantity,
    price: item.furniture_items.price,
    currency: item.furniture_items.currency,
  }))

  const handleItemMove = async (itemId: string, x: number, y: number) => {
    // Optimistic update
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, position_x: x, position_y: y } : i))

    // Persist to DB
    setSaving(true)
    const supabase = createClient()
    await supabase.from('plan_items').update({ position_x: x, position_y: y }).eq('id', itemId)
    setSaving(false)
  }

  const handleExportCSV = () => {
    const rows = [
      ['Room', 'Furniture', 'Category', 'Size (cm)', 'Price', 'Currency', 'Product URL'],
      ...items.map(item => [
        rooms.find(r => r.id === item.room_id)?.name ?? '',
        item.furniture_items.name,
        FURNITURE_CATEGORY_LABELS[item.furniture_items.category] ?? item.furniture_items.category,
        `${item.furniture_items.width_cm} × ${item.furniture_items.depth_cm}`,
        item.furniture_items.price.toFixed(2),
        item.furniture_items.currency,
        item.furniture_items.product_url ?? '',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.name.replace(/[^a-z0-9]/gi, '_')}_shopping_list.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeletePlan = async () => {
    if (!confirm(`Delete "${plan.name}"?`)) return
    const supabase = createClient()
    await supabase.from('layout_plans').delete().eq('id', plan.id)
    router.push(`/properties/${propertyId}/floors/${floorId}`)
    router.refresh()
  }

  // Group items by room
  const itemsByRoom = rooms.map(room => ({
    room,
    items: items.filter(i => i.room_id === room.id),
  })).filter(g => g.items.length > 0)

  const totalPrice = items.reduce((sum, i) => sum + i.furniture_items.price * i.quantity, 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 2D Canvas */}
      <div className="xl:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">2D Floor Plan</h2>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {saving && <span className="text-blue-500">Saving...</span>}
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-1 bg-orange-400 rounded"></span> Door
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-1 bg-cyan-400 rounded"></span> Window
            </span>
            <span>Drag furniture to reposition</span>
          </div>
        </div>
        <FloorPlanCanvas
          rooms={rooms}
          items={canvasItems}
          onItemMove={handleItemMove}
          readOnly={false}
          backgroundImageUrl={backgroundImageUrl}
          totalWidthCm={totalWidthCm}
          totalDepthCm={totalDepthCm}
        />
      </div>

      {/* Side panel: shopping list + AI reasoning */}
      <div className="space-y-4">
        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={handleExportCSV}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            📥 Export CSV
          </button>
          <button onClick={handleDeletePlan}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>

        {/* AI Reasoning */}
        {plan.ai_reasoning && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">✨ AI Design Notes</p>
            <p className="text-xs text-blue-600 leading-relaxed">{plan.ai_reasoning}</p>
          </div>
        )}

        {/* Styles */}
        {plan.style_preferences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {plan.style_preferences.map(s => (
              <span key={s} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{s}</span>
            ))}
          </div>
        )}

        {/* Shopping list by room */}
        {itemsByRoom.map(({ room, items: roomItems }) => (
          <div key={room.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">{room.name}</h3>
              <p className="text-xs text-gray-400">{(room.width_cm / 100).toFixed(1)}m × {(room.depth_cm / 100).toFixed(1)}m</p>
            </div>
            <div className="divide-y divide-gray-50">
              {roomItems.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.furniture_items.name}</p>
                    <p className="text-xs text-gray-400">
                      {FURNITURE_CATEGORY_LABELS[item.furniture_items.category] ?? item.furniture_items.category}
                      {' · '}{item.furniture_items.width_cm}×{item.furniture_items.depth_cm}cm
                    </p>
                    {item.furniture_items.product_url && (
                      <a href={item.furniture_items.product_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline">Buy ↗</a>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.furniture_items.currency} ${item.furniture_items.price.toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-green-800">Total Estimate</span>
          <span className="text-lg font-bold text-green-700">
            {plan.currency} ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
