'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FloorPlanEditor, type FloorRecord } from '@/components/canvas/floor-plan-editor'
import type { FloorPlanData } from '@robinweitzel/floor-planner'
import type { RoomShape } from '@/lib/planner/adapter'

interface Props {
  floor: FloorRecord
  initialRooms: RoomShape[]
  propertyId: string
}

export function FloorEditorClient({ floor, initialRooms, propertyId }: Props) {
  const router = useRouter()
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const handleSave = useCallback(async (
    rooms: RoomShape[],
    plannerState: FloorPlanData,
    calibration: { scale_px_per_cm?: number; calib_offset_x?: number; calib_offset_y?: number }
  ) => {
    const supabase = createClient()

    // 1. Update floor calibration + planner state
    const { error: floorErr } = await supabase
      .from('floors')
      .update({
        planner_state: plannerState as unknown as Record<string, unknown>,
        ...(calibration.scale_px_per_cm != null ? { scale_px_per_cm: calibration.scale_px_per_cm } : {}),
        calib_offset_x: calibration.calib_offset_x ?? 0,
        calib_offset_y: calibration.calib_offset_y ?? 0,
      })
      .eq('id', floor.id)

    if (floorErr) throw floorErr

    // 2. Upsert rooms extracted from the planner
    for (const room of rooms) {
      if (!room.id) continue
      await supabase
        .from('rooms')
        .upsert({
          id: room.id,
          floor_id: floor.id,
          name: room.name,
          width_cm: room.width_cm,
          depth_cm: room.depth_cm,
          position_x: room.position_x,
          position_y: room.position_y,
          doors: room.doors as unknown as Record<string, unknown>[],
          windows: room.windows as unknown as Record<string, unknown>[],
        }, { onConflict: 'id' })
    }

    // 3. Remove rooms that no longer exist in the planner
    const survivingIds = rooms.map(r => r.id).filter(Boolean)
    if (survivingIds.length > 0) {
      await supabase
        .from('rooms')
        .delete()
        .eq('floor_id', floor.id)
        .not('id', 'in', `(${survivingIds.join(',')})`)
    }

    setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(null), 2000)
    router.refresh()
  }, [floor.id, router])

  // Key based on room IDs + image presence — when AI analyze adds/changes rooms or
  // a floor plan image is first uploaded, the editor remounts to pick up the new data.
  const imgKey = floor.floor_plan_image_url ? 'img' : 'noimg'
  const editorKey = initialRooms.length === 0
    ? `${floor.id}-empty-${imgKey}`
    : `${floor.id}-${initialRooms.map(r => r.id).sort().join(',')}-${imgKey}`

  return (
    <div className="relative">
      {saveMsg && (
        <div className="absolute top-0 right-0 z-50 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg shadow">
          {saveMsg}
        </div>
      )}
      <FloorPlanEditor
        key={editorKey}
        floor={floor}
        initialRooms={initialRooms}
        onSave={handleSave}
      />
    </div>
  )
}
