'use client'

/**
 * FloorPlanEditor
 *
 * Wraps @robinweitzel/floor-planner (pure-canvas, no React dep) in a React component.
 *
 * Background image sits ABOVE the canvas (z-index 2, pointer-events none) so it
 * shows through as a semi-transparent overlay — users trace walls on top of it.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import type { FloorPlanData, ToolType } from '@robinweitzel/floor-planner'
import { roomsToFloorPlan, floorPlanToRooms, type RoomShape } from '@/lib/planner/adapter'
import { FtInchInput } from '@/components/ui/ft-inch-input'
import { ftInchToCm } from '@/lib/units'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FloorRecord {
  id: string
  floor_plan_image_url?: string | null
  total_width_cm?: number | null
  total_depth_cm?: number | null
  scale_px_per_cm?: number | null
  calib_offset_x?: number | null
  calib_offset_y?: number | null
  planner_state?: FloorPlanData | null
}

interface CalibPoint { x: number; y: number }

type CalibState =
  | { step: 'idle' }
  | { step: 'pick-a' }
  | { step: 'pick-b'; a: CalibPoint }
  | { step: 'enter-dist'; a: CalibPoint; b: CalibPoint; pixelDist: number }

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  label, icon, active, onClick, title
}: { label: string; icon: string; active?: boolean; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FloorPlanEditorProps {
  floor: FloorRecord
  initialRooms: RoomShape[]
  onSave: (rooms: RoomShape[], plannerState: FloorPlanData, calibration: {
    scale_px_per_cm?: number
    calib_offset_x?: number
    calib_offset_y?: number
  }) => Promise<void>
}

export function FloorPlanEditor({ floor, initialRooms, onSave }: FloorPlanEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const plannerRef   = useRef<import('@robinweitzel/floor-planner').FloorPlanner | null>(null)
  const latestPlan   = useRef<FloorPlanData | null>(null)
  const bgFileRef    = useRef<HTMLInputElement>(null)

  const [activeTool, setActiveTool]   = useState<ToolType | 'opening-door' | 'opening-window'>('select')
  const [saving, setSaving]           = useState(false)
  const [bgUrl, setBgUrl]             = useState<string | null>(floor.floor_plan_image_url ?? null)
  const [bgOpacity, setBgOpacity]     = useState(0.35)
  const [bgVisible, setBgVisible]     = useState(true)
  const [bgUploading, setBgUploading] = useState(false)

  // Sync bgUrl when the floor prop's image URL changes (e.g. after AI analyze + router.refresh())
  useEffect(() => {
    if (floor.floor_plan_image_url) {
      setBgUrl(floor.floor_plan_image_url)
      setBgVisible(true)
    }
  }, [floor.floor_plan_image_url])
  const [calibState, setCalibState]   = useState<CalibState>({ step: 'idle' })
  const [calibDistCm, setCalibDistCm] = useState(0)
  const [scalePxPerCm, setScalePxPerCm] = useState(floor.scale_px_per_cm ?? null)
  const [calibOffsetX, setCalibOffsetX] = useState(floor.calib_offset_x ?? 0)
  const [calibOffsetY, setCalibOffsetY] = useState(floor.calib_offset_y ?? 0)
  const [calibPoints, setCalibPoints] = useState<{ a?: CalibPoint; b?: CalibPoint }>({})

  // ── Mount floor planner ───────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false

    async function init() {
      const { FloorPlanner } = await import('@robinweitzel/floor-planner')
      if (destroyed || !containerRef.current) return

      const planner = new FloorPlanner(containerRef.current, {
        mode: 'edit',
        snap: { grid: true, endpoint: true, gridSize: 2.54 }, // 1-inch snapping
      })

      // Override the default deep-blue theme with a clean white/black architectural style.
      // The library stores the theme on planner.engine.renderer.style (internal but stable).
      const whiteTheme = {
        background:      '#ffffff',
        wall:            '#1a1a1a',
        wallFill:        '#1a1a1a',
        furnitureFill:   'transparent',
        furnitureStroke: '#374151',
        furnitureLabel:  'rgba(30,30,30,0.85)',
        grid:            'rgba(0,0,0,0.06)',
        gridMajor:       'rgba(0,0,0,0.13)',
        selection:       '#2563eb',
        selectionGlow:   'rgba(37,99,235,0.18)',
        preview:         'rgba(0,0,0,0.3)',
        openingClear:    '#ffffff',
        wallLineCap:     'butt',
        gridType:        'lines',
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderer = (planner as any)?.engine?.renderer
      if (renderer?.style) Object.assign(renderer.style, whiteTheme)

      const furnitureTypes = [
        { id: 'sofa',         label: 'Sofa',        shape: 'rectangle' as const, defaultWidth: 200, defaultHeight: 90  },
        { id: 'armchair',     label: 'Armchair',    shape: 'rectangle' as const, defaultWidth: 90,  defaultHeight: 90  },
        { id: 'coffee_table', label: 'Coffee Tbl',  shape: 'rectangle' as const, defaultWidth: 120, defaultHeight: 60  },
        { id: 'side_table',   label: 'Side Table',  shape: 'rectangle' as const, defaultWidth: 50,  defaultHeight: 50  },
        { id: 'tv_stand',     label: 'TV Stand',    shape: 'rectangle' as const, defaultWidth: 160, defaultHeight: 45  },
        { id: 'dining_table', label: 'Dining Tbl',  shape: 'rectangle' as const, defaultWidth: 150, defaultHeight: 90  },
        { id: 'dining_chair', label: 'Din. Chair',  shape: 'rectangle' as const, defaultWidth: 45,  defaultHeight: 45  },
        { id: 'bed',          label: 'Bed (Queen)', shape: 'rectangle' as const, defaultWidth: 152, defaultHeight: 203 },
        { id: 'nightstand',   label: 'Nightstand',  shape: 'rectangle' as const, defaultWidth: 50,  defaultHeight: 50  },
        { id: 'dresser',      label: 'Dresser',     shape: 'rectangle' as const, defaultWidth: 120, defaultHeight: 50  },
        { id: 'wardrobe',     label: 'Wardrobe',    shape: 'rectangle' as const, defaultWidth: 180, defaultHeight: 60  },
        { id: 'desk',         label: 'Desk',        shape: 'rectangle' as const, defaultWidth: 120, defaultHeight: 60  },
        { id: 'office_chair', label: 'Office Chr',  shape: 'rectangle' as const, defaultWidth: 60,  defaultHeight: 60  },
        { id: 'bookshelf',    label: 'Bookshelf',   shape: 'rectangle' as const, defaultWidth: 80,  defaultHeight: 30  },
      ]
      for (const ft of furnitureTypes) planner.registerFurniture(ft)

      const initialData = floor.planner_state ?? roomsToFloorPlan(initialRooms)
      planner.loadJSON(initialData)
      latestPlan.current = initialData
      planner.on('change', ({ plan }) => { latestPlan.current = plan })
      setTimeout(() => planner.zoomToFit(), 150)

      plannerRef.current = planner
    }

    init()

    return () => {
      destroyed = true
      plannerRef.current?.destroy()
      plannerRef.current = null
    }
    // key-based remounting handles data refresh — no extra deps needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Tool activation ───────────────────────────────────────────────────────
  const selectTool = useCallback((tool: typeof activeTool) => {
    const planner = plannerRef.current
    if (!planner) return
    setActiveTool(tool)
    if (tool === 'select')              planner.setTool('select')
    else if (tool === 'wall')           planner.setTool('wall')
    else if (tool === 'opening-door')   planner.setTool('opening', { type: 'door' })
    else if (tool === 'opening-window') planner.setTool('opening', { type: 'window' })
  }, [])

  const handleDelete   = useCallback(() => plannerRef.current?.deleteSelected(), [])
  const handleFlipDoor = useCallback(() => plannerRef.current?.flipDoorDirection(), [])
  const handleUndo     = useCallback(() => plannerRef.current?.undo(), [])
  const handleRedo     = useCallback(() => plannerRef.current?.redo(), [])

  // ── Background image upload (no AI, just set the underlay) ────────────────
  const handleBgFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBgUploading(true)

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setBgUrl(localUrl)
    setBgVisible(true)

    // Upload to Supabase storage
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const ext = file.type.split('/')[1] ?? 'jpg'
      const path = `floors/${floor.id}/plan.${ext}`
      await supabase.storage.from('floor-plans').upload(path, file, { contentType: file.type, upsert: true })
      await supabase.from('floors').update({ floor_plan_image_path: path }).eq('id', floor.id)
    } catch (err) {
      console.error('Failed to save background image:', err)
    } finally {
      setBgUploading(false)
      if (bgFileRef.current) bgFileRef.current.value = ''
    }
  }, [floor.id])

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!latestPlan.current) return
    setSaving(true)
    try {
      const rooms = floorPlanToRooms(latestPlan.current)
      await onSave(rooms, latestPlan.current, {
        scale_px_per_cm: scalePxPerCm ?? undefined,
        calib_offset_x: calibOffsetX,
        calib_offset_y: calibOffsetY,
      })
    } finally {
      setSaving(false)
    }
  }, [onSave, scalePxPerCm, calibOffsetX, calibOffsetY])

  // ── Manual 2-point calibration ────────────────────────────────────────────
  const startCalib  = () => { setCalibState({ step: 'pick-a' }); setCalibPoints({}) }
  const cancelCalib = () => { setCalibState({ step: 'idle' });   setCalibPoints({}) }

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (calibState.step === 'idle') return
    // Only capture clicks on the bg image area (block during normal editing)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (calibState.step === 'pick-a') {
      setCalibPoints({ a: { x, y } })
      setCalibState({ step: 'pick-b', a: { x, y } })
    } else if (calibState.step === 'pick-b') {
      const b = { x, y }
      const pxDist = Math.hypot(b.x - calibState.a.x, b.y - calibState.a.y)
      setCalibPoints(prev => ({ ...prev, b }))
      setCalibState({ step: 'enter-dist', a: calibState.a, b, pixelDist: pxDist })
    }
  }, [calibState])

  const applyCalib = useCallback(() => {
    if (calibState.step !== 'enter-dist') return
    if (calibDistCm <= 0) return
    setScalePxPerCm(calibState.pixelDist / calibDistCm)
    setCalibState({ step: 'idle' })
    setCalibPoints({})
  }, [calibState, calibDistCm])

  const calibInProgress = calibState.step !== 'idle'

  return (
    <div className="flex flex-col gap-3">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">

        {/* Drawing tools */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
          <ToolBtn icon="↖" label="Select"  active={activeTool === 'select'}         onClick={() => selectTool('select')}         title="Select / move" />
          <ToolBtn icon="▬" label="Wall"    active={activeTool === 'wall'}           onClick={() => selectTool('wall')}           title="Draw wall" />
          <ToolBtn icon="🚪" label="Door"   active={activeTool === 'opening-door'}   onClick={() => selectTool('opening-door')}   title="Place door (click a wall)" />
          <ToolBtn icon="🪟" label="Window" active={activeTool === 'opening-window'} onClick={() => selectTool('opening-window')} title="Place window (click a wall)" />
        </div>

        {/* Edit actions */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
          <ToolBtn icon="↩" label="Undo"   onClick={handleUndo}     title="Undo (Ctrl+Z)" />
          <ToolBtn icon="↪" label="Redo"   onClick={handleRedo}     title="Redo (Ctrl+Y)" />
          <ToolBtn icon="🗑" label="Delete" onClick={handleDelete}   title="Delete selected (Del)" />
          <ToolBtn icon="↔" label="Flip"   onClick={handleFlipDoor} title="Flip door swing direction" />
        </div>

        {/* Background image controls — always visible */}
        <div className="flex items-center gap-2 border-r border-gray-200 pr-2 mr-1">
          {/* Upload/change background */}
          <button
            onClick={() => bgFileRef.current?.click()}
            disabled={bgUploading}
            title="Set floor plan image as background underlay"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors"
          >
            {bgUploading ? (
              <><span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /><span className="hidden sm:inline">Uploading…</span></>
            ) : (
              <><span>🖼</span><span className="hidden sm:inline">{bgUrl ? 'Change BG' : 'Set BG Image'}</span></>
            )}
          </button>
          <input ref={bgFileRef} type="file" accept="image/*" onChange={handleBgFileChange} className="hidden" />

          {/* Opacity + visibility (only when image is set) */}
          {bgUrl && (
            <>
              <button
                onClick={() => setBgVisible(v => !v)}
                title={bgVisible ? 'Hide background' : 'Show background'}
                className={`px-2 py-1.5 rounded-lg text-sm border transition-colors ${bgVisible ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {bgVisible ? '👁' : '🚫'}
              </button>
              {bgVisible && (
                <input
                  type="range" min={0.05} max={0.8} step={0.05}
                  value={bgOpacity}
                  onChange={e => setBgOpacity(parseFloat(e.target.value))}
                  className="w-20 accent-blue-600"
                  title={`Background opacity: ${Math.round(bgOpacity * 100)}%`}
                />
              )}
              <button
                onClick={startCalib}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors
                  ${calibInProgress
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                title="2-point calibration: click two known points, enter the real distance"
              >
                {calibInProgress ? '⏳ Calibrating…' : '📐 Calibrate'}
              </button>
            </>
          )}
        </div>

        {/* View */}
        <ToolBtn icon="⊡" label="Fit" onClick={() => plannerRef.current?.zoomToFit()} title="Zoom to fit all walls" />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* ── Calibration instructions ── */}
      {calibInProgress && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex flex-wrap items-center gap-3">
          {calibState.step === 'pick-a' && (
            <p><strong>Step 1/3</strong> — Click point A on the background image (e.g. one end of a wall whose length you know).</p>
          )}
          {calibState.step === 'pick-b' && (
            <p><strong>Step 2/3</strong> — Click point B on the background image.</p>
          )}
          {calibState.step === 'enter-dist' && (
            <>
              <p className="font-medium">Step 3/3 — What is the real distance between those two points?</p>
              <FtInchInput
                valueCm={calibDistCm}
                onChangeCm={setCalibDistCm}
                min={1}
              />
              <div className="flex gap-2">
                <button onClick={applyCalib} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700">Apply</button>
                <button onClick={cancelCalib} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </>
          )}
          {calibState.step !== 'enter-dist' && (
            <button onClick={cancelCalib} className="ml-auto text-xs underline text-amber-600">Cancel</button>
          )}
        </div>
      )}

      {/* ── Canvas + background overlay ── */}
      <div
        className="relative rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm"
        style={{ height: 600, cursor: calibInProgress ? 'crosshair' : 'default' }}
        onClick={calibInProgress ? handleCanvasClick : undefined}
      >
        {/* Floor planner canvas — z-index 1, fills container */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        />

        {/* Background image — z-index 2, overlaid ON TOP of canvas, pointer-events none */}
        {/* Users see it as a semi-transparent guide while tracing walls */}
        {bgUrl && bgVisible && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgUrl}
            alt="Floor plan background"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{ opacity: bgOpacity, zIndex: 2 }}
          />
        )}

        {/* Calibration point markers — z-index 3 */}
        {calibPoints.a && (
          <div
            className="absolute w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-md -translate-x-2.5 -translate-y-2.5 pointer-events-none flex items-center justify-center text-white text-xs font-bold"
            style={{ left: calibPoints.a.x, top: calibPoints.a.y, zIndex: 3 }}
          >A</div>
        )}
        {calibPoints.b && (
          <div
            className="absolute w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-md -translate-x-2.5 -translate-y-2.5 pointer-events-none flex items-center justify-center text-white text-xs font-bold"
            style={{ left: calibPoints.b.x, top: calibPoints.b.y, zIndex: 3 }}
          >B</div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
        <span>Units: ft / in · Snap: 1&quot;</span>
        {scalePxPerCm && <span>Scale: {scalePxPerCm.toFixed(2)} px/cm</span>}
        {bgUrl && bgVisible && <span>BG: {Math.round(bgOpacity * 100)}% opacity</span>}
        <span className="ml-auto">Scroll to zoom · Middle-drag to pan · Draw walls first, then click wall to add door/window</span>
      </div>
    </div>
  )
}
