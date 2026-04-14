'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Arc, Image as KonvaImage } from 'react-konva'
import type Konva from 'konva'
import { CATEGORY_COLORS } from '@/lib/constants'
import { formatFtInch } from '@/lib/units'

interface Door { x: number; y: number; width: number; wall: string }
interface Window { x: number; y: number; width: number; wall: string }

interface Room {
  id: string
  name: string
  width_cm: number
  depth_cm: number
  position_x: number
  position_y: number
  doors: Door[] | null
  windows: Window[] | null
}

interface PlacedItem {
  id: string
  room_id: string
  furniture_item_id: string
  furniture_name: string
  furniture_category: string
  width_cm: number
  depth_cm: number
  position_x: number
  position_y: number
  rotation: number
  quantity: number
  price: number
  currency: string
}

interface FloorPlanCanvasProps {
  rooms: Room[]
  items: PlacedItem[]
  onItemMove?: (itemId: string, x: number, y: number) => void
  readOnly?: boolean
  backgroundImageUrl?: string
  totalWidthCm?: number
  totalDepthCm?: number
}

const PADDING = 60
const SNAP = 10 // cm

// Only auto-arrange if rooms genuinely have no positional data (all identical positions)
function autoArrangeRooms(rooms: Room[]): Room[] {
  if (rooms.length <= 1) return rooms

  // Check if all positions are identical (not just all zero — also catches all same non-zero)
  const positions = rooms.map(r => `${r.position_x},${r.position_y}`)
  const uniquePositions = new Set(positions)
  if (uniquePositions.size > 1) return rooms // positions are varied — trust them

  // All same position: auto-arrange in a grid
  const GAP = 80
  const COLS = Math.ceil(Math.sqrt(rooms.length))
  const colHeights: number[] = new Array(COLS).fill(0)
  const colWidths: number[] = new Array(COLS).fill(0)

  return rooms.map((room, idx) => {
    const col = idx % COLS
    const row = Math.floor(idx / COLS)
    const x = colWidths.slice(0, col).reduce((a, b) => a + b + GAP, 0)
    const y = colHeights.slice(0, row).reduce((a, b) => a + b + GAP, 0)
    // Update column width tracking
    colWidths[col] = Math.max(colWidths[col], room.width_cm)
    if (idx >= COLS) colHeights[row - 1] = Math.max(colHeights[row - 1] ?? 0, room.depth_cm)
    return { ...room, position_x: x, position_y: y }
  })
}

function calcScale(rooms: Room[], containerWidth: number): number {
  if (rooms.length === 0) return 0.5
  const maxX = Math.max(...rooms.map(r => r.position_x + r.width_cm))
  const maxY = Math.max(...rooms.map(r => r.position_y + r.depth_cm))
  const availW = containerWidth - PADDING * 2
  const availH = 600 - PADDING * 2
  const scaleX = availW / maxX
  const scaleY = availH / maxY
  return Math.min(scaleX, scaleY, 0.9)
}

export function FloorPlanCanvas({ rooms, items, onItemMove, readOnly = false, backgroundImageUrl, totalWidthCm, totalDepthCm }: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(900)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!backgroundImageUrl) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = backgroundImageUrl
    img.onload = () => setBgImage(img)
  }, [backgroundImageUrl])

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const arranged = autoArrangeRooms(rooms)
  const scale = calcScale(arranged, containerWidth)

  const px = useCallback((cm: number) => cm * scale, [scale])

  const stageWidth = containerWidth
  const stageHeight = arranged.length > 0
    ? Math.max(500, Math.max(...arranged.map(r => r.position_y + r.depth_cm)) * scale + PADDING * 2)
    : 500

  const roomScreenX = (r: Room) => px(r.position_x) + PADDING
  const roomScreenY = (r: Room) => px(r.position_y) + PADDING

  const handleDragEnd = (itemId: string, e: Konva.KonvaEventObject<DragEvent>, room: Room) => {
    if (readOnly || !onItemMove) return
    const node = e.target
    const rx = roomScreenX(room)
    const ry = roomScreenY(room)
    const item = items.find(i => i.id === itemId)
    if (!item) return

    let newX = Math.round((node.x() - rx) / (SNAP * scale)) * (SNAP * scale)
    let newY = Math.round((node.y() - ry) / (SNAP * scale)) * (SNAP * scale)
    newX = Math.max(0, Math.min(px(room.width_cm) - px(item.width_cm), newX))
    newY = Math.max(0, Math.min(px(room.depth_cm) - px(item.depth_cm), newY))
    node.x(rx + newX)
    node.y(ry + newY)
    onItemMove(itemId, Math.round(newX / scale), Math.round(newY / scale))
  }

  if (rooms.length === 0) return null

  return (
    <div ref={containerRef} className="w-full overflow-auto rounded-xl border border-gray-100 bg-[#f0f0f0]">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* Floor background */}
          <Rect x={0} y={0} width={stageWidth} height={stageHeight} fill="#f0f0f0" />

          {/* Original floor plan image as background */}
          {bgImage && totalWidthCm && totalDepthCm && (
            <KonvaImage
              image={bgImage}
              x={PADDING}
              y={PADDING}
              width={px(totalWidthCm)}
              height={px(totalDepthCm)}
              opacity={0.3}
              listening={false}
            />
          )}

          {arranged.map(room => {
            const rx = roomScreenX(room)
            const ry = roomScreenY(room)
            const rw = px(room.width_cm)
            const rh = px(room.depth_cm)
            const roomItems = items.filter(i => i.room_id === room.id)
            const WALL = Math.max(2, scale * 8) // wall thickness in px

            return (
              <Group key={room.id}>
                {/* Room fill */}
                <Rect x={rx} y={ry} width={rw} height={rh} fill="#ffffff" />

                {/* Walls - drawn as thick border segments */}
                {/* Top wall */}
                <Rect x={rx} y={ry} width={rw} height={WALL} fill="#2d2d2d" />
                {/* Bottom wall */}
                <Rect x={rx} y={ry + rh - WALL} width={rw} height={WALL} fill="#2d2d2d" />
                {/* Left wall */}
                <Rect x={rx} y={ry} width={WALL} height={rh} fill="#2d2d2d" />
                {/* Right wall */}
                <Rect x={rx + rw - WALL} y={ry} width={WALL} height={rh} fill="#2d2d2d" />

                {/* Doors - gap in wall + swing arc */}
                {(room.doors ?? []).map((door, i) => {
                  const ds = px(door.x)
                  const dw = px(door.width)

                  if (door.wall === 'top') return (
                    <Group key={`d${i}`}>
                      <Rect x={rx + ds} y={ry} width={dw} height={WALL} fill="#ffffff" />
                      <Arc x={rx + ds} y={ry + WALL} innerRadius={0} outerRadius={dw}
                        angle={90} rotation={0} fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth={1} dash={[3,2]} />
                    </Group>
                  )
                  if (door.wall === 'bottom') return (
                    <Group key={`d${i}`}>
                      <Rect x={rx + ds} y={ry + rh - WALL} width={dw} height={WALL} fill="#ffffff" />
                      <Arc x={rx + ds} y={ry + rh - WALL} innerRadius={0} outerRadius={dw}
                        angle={90} rotation={-90} fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth={1} dash={[3,2]} />
                    </Group>
                  )
                  if (door.wall === 'left') return (
                    <Group key={`d${i}`}>
                      <Rect x={rx} y={ry + ds} width={WALL} height={dw} fill="#ffffff" />
                      <Arc x={rx + WALL} y={ry + ds} innerRadius={0} outerRadius={dw}
                        angle={90} rotation={90} fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth={1} dash={[3,2]} />
                    </Group>
                  )
                  if (door.wall === 'right') return (
                    <Group key={`d${i}`}>
                      <Rect x={rx + rw - WALL} y={ry + ds} width={WALL} height={dw} fill="#ffffff" />
                      <Arc x={rx + rw - WALL} y={ry + ds} innerRadius={0} outerRadius={dw}
                        angle={90} rotation={180} fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth={1} dash={[3,2]} />
                    </Group>
                  )
                  return null
                })}

                {/* Windows - gap with double cyan lines */}
                {(room.windows ?? []).map((win, i) => {
                  const ws = px(win.x)
                  const ww = px(win.width)
                  const wt = WALL

                  if (win.wall === 'top') return (
                    <Group key={`w${i}`}>
                      <Rect x={rx + ws} y={ry} width={ww} height={wt} fill="#bfdbfe" />
                      <Line points={[rx + ws, ry + wt * 0.25, rx + ws + ww, ry + wt * 0.25]} stroke="#3b82f6" strokeWidth={1} />
                      <Line points={[rx + ws, ry + wt * 0.75, rx + ws + ww, ry + wt * 0.75]} stroke="#3b82f6" strokeWidth={1} />
                    </Group>
                  )
                  if (win.wall === 'bottom') return (
                    <Group key={`w${i}`}>
                      <Rect x={rx + ws} y={ry + rh - wt} width={ww} height={wt} fill="#bfdbfe" />
                      <Line points={[rx + ws, ry + rh - wt * 0.25, rx + ws + ww, ry + rh - wt * 0.25]} stroke="#3b82f6" strokeWidth={1} />
                      <Line points={[rx + ws, ry + rh - wt * 0.75, rx + ws + ww, ry + rh - wt * 0.75]} stroke="#3b82f6" strokeWidth={1} />
                    </Group>
                  )
                  if (win.wall === 'left') return (
                    <Group key={`w${i}`}>
                      <Rect x={rx} y={ry + ws} width={wt} height={ww} fill="#bfdbfe" />
                      <Line points={[rx + wt * 0.25, ry + ws, rx + wt * 0.25, ry + ws + ww]} stroke="#3b82f6" strokeWidth={1} />
                      <Line points={[rx + wt * 0.75, ry + ws, rx + wt * 0.75, ry + ws + ww]} stroke="#3b82f6" strokeWidth={1} />
                    </Group>
                  )
                  if (win.wall === 'right') return (
                    <Group key={`w${i}`}>
                      <Rect x={rx + rw - wt} y={ry + ws} width={wt} height={ww} fill="#bfdbfe" />
                      <Line points={[rx + rw - wt * 0.25, ry + ws, rx + rw - wt * 0.25, ry + ws + ww]} stroke="#3b82f6" strokeWidth={1} />
                      <Line points={[rx + rw - wt * 0.75, ry + ws, rx + rw - wt * 0.75, ry + ws + ww]} stroke="#3b82f6" strokeWidth={1} />
                    </Group>
                  )
                  return null
                })}

                {/* Furniture */}
                {roomItems.map(item => {
                  const fw = px(item.width_cm)
                  const fh = px(item.depth_cm)
                  const fx = rx + px(item.position_x)
                  const fy = ry + px(item.position_y)
                  const color = CATEGORY_COLORS[item.furniture_category] ?? '#e5e7eb'
                  const fontSize = Math.max(7, Math.min(11, fw / 8))

                  return (
                    <Group
                      key={item.id}
                      x={fx + fw / 2}
                      y={fy + fh / 2}
                      offsetX={fw / 2}
                      offsetY={fh / 2}
                      rotation={item.rotation ?? 0}
                      draggable={!readOnly}
                      onDragEnd={(e) => handleDragEnd(item.id, e, room)}
                    >
                      <Rect
                        x={-fw / 2} y={-fh / 2}
                        width={fw} height={fh}
                        fill={color}
                        stroke="#64748b"
                        strokeWidth={0.8}
                        cornerRadius={2}
                        shadowColor="#000"
                        shadowBlur={3}
                        shadowOpacity={0.12}
                        shadowOffsetX={1}
                        shadowOffsetY={1}
                      />
                      {/* Furniture label */}
                      <Text
                        x={-fw / 2 + 2} y={-fh / 2 + 2}
                        width={fw - 4} height={fh - 4}
                        text={item.furniture_name.replace(/^(IKEA |Wayfair )/i, '')}
                        fontSize={fontSize}
                        fill="#1e293b"
                        align="center"
                        verticalAlign="middle"
                        wrap="word"
                        ellipsis
                        fontStyle="500"
                      />
                    </Group>
                  )
                })}

                {/* Room label - bottom of room */}
                <Rect
                  x={rx + WALL}
                  y={ry + rh - WALL - 22}
                  width={rw - WALL * 2}
                  height={20}
                  fill="rgba(255,255,255,0.8)"
                  cornerRadius={2}
                />
                <Text
                  x={rx + WALL + 4}
                  y={ry + rh - WALL - 20}
                  width={rw - WALL * 2 - 8}
                  text={`${room.name}  ${formatFtInch(room.width_cm)}×${formatFtInch(room.depth_cm)}`}
                  fontSize={Math.max(8, Math.min(11, rw / 14))}
                  fill="#374151"
                  fontStyle="bold"
                  align="center"
                />

                {/* Dimension lines */}
                {/* Width */}
                <Line
                  points={[rx, ry - 14, rx + rw, ry - 14]}
                  stroke="#94a3b8" strokeWidth={1}
                />
                <Line points={[rx, ry - 18, rx, ry - 10]} stroke="#94a3b8" strokeWidth={1} />
                <Line points={[rx + rw, ry - 18, rx + rw, ry - 10]} stroke="#94a3b8" strokeWidth={1} />
                <Text
                  x={rx} y={ry - 24} width={rw}
                  text={formatFtInch(room.width_cm)}
                  fontSize={8} fill="#94a3b8" align="center"
                />
              </Group>
            )
          })}

          {/* Scale bar */}
          {(() => {
            const barCm = 100
            const barPx = px(barCm)
            const bx = PADDING
            const by = stageHeight - 28
            return (
              <Group>
                <Rect x={bx} y={by + 6} width={barPx} height={4} fill="#94a3b8" />
                <Rect x={bx} y={by + 4} width={2} height={8} fill="#94a3b8" />
                <Rect x={bx + barPx} y={by + 4} width={2} height={8} fill="#94a3b8" />
                <Text x={bx} y={by} width={barPx} text="3'3&quot;" fontSize={9} fill="#64748b" align="center" />
              </Group>
            )
          })()}
        </Layer>
      </Stage>
    </div>
  )
}
