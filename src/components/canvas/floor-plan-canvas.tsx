'use client'

import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva'
import type Konva from 'konva'
import { CATEGORY_COLORS } from '@/lib/constants'

interface Door { x: number; y: number; width: number; wall: string }
interface Window { x: number; y: number; width: number; wall: string }

interface Room {
  id: string
  name: string
  width_cm: number
  depth_cm: number
  position_x: number
  position_y: number
  doors: Door[]
  windows: Window[]
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
}

const SCALE = 0.4 // pixels per cm
const PADDING = 40

export function FloorPlanCanvas({ rooms, items, onItemMove, readOnly = false }: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (containerRef.current) {
      setSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }
  }, [])

  if (rooms.length === 0) return null

  // Calculate bounding box of all rooms
  const maxX = Math.max(...rooms.map(r => r.position_x + r.width_cm)) * SCALE + PADDING * 2
  const maxY = Math.max(...rooms.map(r => r.position_y + r.depth_cm)) * SCALE + PADDING * 2

  const stageWidth = Math.max(size.width, maxX)
  const stageHeight = Math.max(400, maxY)

  const toPixels = (cm: number) => cm * SCALE
  const roomX = (room: Room) => toPixels(room.position_x) + PADDING
  const roomY = (room: Room) => toPixels(room.position_y) + PADDING

  const getDoorPoints = (door: Door, room: Room): number[] => {
    const rx = roomX(room)
    const ry = roomY(room)
    const w = toPixels(room.width_cm)
    const h = toPixels(room.depth_cm)
    const doorStart = toPixels(door.x)
    const doorWidth = toPixels(door.width)

    switch (door.wall) {
      case 'top': return [rx + doorStart, ry, rx + doorStart + doorWidth, ry]
      case 'bottom': return [rx + doorStart, ry + h, rx + doorStart + doorWidth, ry + h]
      case 'left': return [rx, ry + doorStart, rx, ry + doorStart + doorWidth]
      case 'right': return [rx + w, ry + doorStart, rx + w, ry + doorStart + doorWidth]
      default: return []
    }
  }

  const getWindowPoints = (win: Window, room: Room): { points: number[]; offset: number } => {
    const rx = roomX(room)
    const ry = roomY(room)
    const w = toPixels(room.width_cm)
    const h = toPixels(room.depth_cm)
    const winStart = toPixels(win.x)
    const winWidth = toPixels(win.width)
    const offset = 4

    switch (win.wall) {
      case 'top': return { points: [rx + winStart, ry, rx + winStart + winWidth, ry], offset }
      case 'bottom': return { points: [rx + winStart, ry + h, rx + winStart + winWidth, ry + h], offset }
      case 'left': return { points: [rx, ry + winStart, rx, ry + winStart + winWidth], offset }
      case 'right': return { points: [rx + w, ry + winStart, rx + w, ry + winStart + winWidth], offset }
      default: return { points: [], offset }
    }
  }

  const SNAP = 10 // snap to 10cm grid

  const handleDragEnd = (itemId: string, e: Konva.KonvaEventObject<DragEvent>, room: Room) => {
    if (readOnly || !onItemMove) return

    const node = e.target
    const rx = roomX(room)
    const ry = roomY(room)

    // Snap to grid
    let newX = Math.round((node.x() - rx) / (SNAP * SCALE)) * (SNAP * SCALE)
    let newY = Math.round((node.y() - ry) / (SNAP * SCALE)) * (SNAP * SCALE)

    // Clamp within room bounds
    const item = items.find(i => i.id === itemId)
    if (item) {
      const itemW = toPixels(item.width_cm)
      const itemH = toPixels(item.depth_cm)
      newX = Math.max(0, Math.min(toPixels(room.width_cm) - itemW, newX))
      newY = Math.max(0, Math.min(toPixels(room.depth_cm) - itemH, newY))
    }

    node.x(rx + newX)
    node.y(ry + newY)

    onItemMove(itemId, Math.round(newX / SCALE), Math.round(newY / SCALE))
  }

  return (
    <div ref={containerRef} className="w-full overflow-auto rounded-xl border border-gray-200 bg-white">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {rooms.map(room => {
            const rx = roomX(room)
            const ry = roomY(room)
            const rw = toPixels(room.width_cm)
            const rh = toPixels(room.depth_cm)
            const roomItems = items.filter(i => i.room_id === room.id)

            return (
              <Group key={room.id}>
                {/* Room background */}
                <Rect x={rx} y={ry} width={rw} height={rh} fill="#f9fafb" stroke="#374151" strokeWidth={2} />

                {/* Room label */}
                <Text
                  x={rx + 6} y={ry + 5}
                  text={`${room.name}\n${(room.width_cm / 100).toFixed(1)}m × ${(room.depth_cm / 100).toFixed(1)}m`}
                  fontSize={10} fill="#6b7280" fontStyle="bold"
                />

                {/* Doors (gap in wall = white line) */}
                {room.doors.map((door, i) => {
                  const pts = getDoorPoints(door, room)
                  return pts.length > 0 ? (
                    <Line key={`door-${i}`} points={pts} stroke="white" strokeWidth={5} />
                  ) : null
                })}

                {/* Door markers (orange) */}
                {room.doors.map((door, i) => {
                  const pts = getDoorPoints(door, room)
                  return pts.length > 0 ? (
                    <Line key={`door-mark-${i}`} points={pts} stroke="#f97316" strokeWidth={3} dash={[4, 2]} />
                  ) : null
                })}

                {/* Windows (double line = cyan) */}
                {room.windows.map((win, i) => {
                  const { points } = getWindowPoints(win, room)
                  return points.length > 0 ? (
                    <Group key={`win-${i}`}>
                      <Line points={points} stroke="#06b6d4" strokeWidth={5} />
                    </Group>
                  ) : null
                })}

                {/* Furniture items */}
                {roomItems.map(item => {
                  const fw = toPixels(item.width_cm)
                  const fh = toPixels(item.depth_cm)
                  const fx = rx + toPixels(item.position_x)
                  const fy = ry + toPixels(item.position_y)
                  const color = CATEGORY_COLORS[item.furniture_category] ?? '#e5e7eb'

                  return (
                    <Group
                      key={item.id}
                      x={fx}
                      y={fy}
                      draggable={!readOnly}
                      onDragEnd={(e) => handleDragEnd(item.id, e, room)}
                    >
                      <Rect
                        width={fw}
                        height={fh}
                        fill={color}
                        stroke="#374151"
                        strokeWidth={1}
                        cornerRadius={2}
                        shadowColor="black"
                        shadowBlur={readOnly ? 0 : 4}
                        shadowOpacity={0.1}
                      />
                      <Text
                        x={3} y={3}
                        width={fw - 6}
                        height={fh - 6}
                        text={item.furniture_name}
                        fontSize={9}
                        fill="#1f2937"
                        align="center"
                        verticalAlign="middle"
                        wrap="word"
                        ellipsis
                      />
                    </Group>
                  )
                })}
              </Group>
            )
          })}

          {/* Legend */}
          <Line points={[PADDING, stageHeight - 20, PADDING + 40 * SCALE, stageHeight - 20]} stroke="#374151" strokeWidth={1} />
          <Text x={PADDING} y={stageHeight - 14} text={`= 40cm`} fontSize={9} fill="#9ca3af" />
        </Layer>
      </Stage>
    </div>
  )
}
