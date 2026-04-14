/**
 * Bidirectional adapter between our Supabase rooms schema
 * and @robinweitzel/floor-planner's FloorPlanData format.
 *
 * Coordinate units: centimeters (cm) throughout.
 */

import type { FloorPlanData, WallData, OpeningData } from '@robinweitzel/floor-planner'

const WALL_THICKNESS_CM = 15 // ~6 inches, standard US interior wall

/** When two room edges are within this distance, snap them together. */
const SNAP_TOLERANCE_CM = 10

/** When two walls are within this distance of each other (collinear), merge them. */
const MERGE_TOLERANCE_CM = 5

export interface RoomShape {
  id: string
  name: string
  width_cm: number
  depth_cm: number
  position_x: number
  position_y: number
  doors:   { x: number; width: number; wall: string }[]
  windows: { x: number; width: number; wall: string }[]
}

// ─── Snap room edges ─────────────────────────────────────────────────────────

/**
 * For each pair of rooms whose edges are within SNAP_TOLERANCE_CM of each other,
 * snap them to share a clean edge. This corrects AI coordinate imprecision.
 */
function snapRoomsToSharedEdges(rooms: RoomShape[]): RoomShape[] {
  const snapped = rooms.map(r => ({ ...r }))

  for (let i = 0; i < snapped.length; i++) {
    for (let j = i + 1; j < snapped.length; j++) {
      const a = snapped[i]
      const b = snapped[j]

      // Right edge of A vs left edge of B
      const aRight = a.position_x + a.width_cm
      const gap_RL = b.position_x - aRight
      if (Math.abs(gap_RL) <= SNAP_TOLERANCE_CM && gap_RL !== 0) {
        const mid = Math.round((aRight + b.position_x) / 2)
        snapped[i] = { ...snapped[i], width_cm: mid - snapped[i].position_x }
        snapped[j] = { ...snapped[j], position_x: mid }
      }

      // Right edge of B vs left edge of A
      const bRight = b.position_x + b.width_cm
      const gap_LR = a.position_x - bRight
      if (Math.abs(gap_LR) <= SNAP_TOLERANCE_CM && gap_LR !== 0) {
        const mid = Math.round((bRight + a.position_x) / 2)
        snapped[j] = { ...snapped[j], width_cm: mid - snapped[j].position_x }
        snapped[i] = { ...snapped[i], position_x: mid }
      }

      // Bottom edge of A vs top edge of B
      const aBottom = a.position_y + a.depth_cm
      const gap_BT = b.position_y - aBottom
      if (Math.abs(gap_BT) <= SNAP_TOLERANCE_CM && gap_BT !== 0) {
        const mid = Math.round((aBottom + b.position_y) / 2)
        snapped[i] = { ...snapped[i], depth_cm: mid - snapped[i].position_y }
        snapped[j] = { ...snapped[j], position_y: mid }
      }

      // Bottom edge of B vs top edge of A
      const bBottom = b.position_y + b.depth_cm
      const gap_TB = a.position_y - bBottom
      if (Math.abs(gap_TB) <= SNAP_TOLERANCE_CM && gap_TB !== 0) {
        const mid = Math.round((bBottom + a.position_y) / 2)
        snapped[j] = { ...snapped[j], depth_cm: mid - snapped[j].position_y }
        snapped[i] = { ...snapped[i], position_y: mid }
      }
    }
  }

  return snapped
}

// ─── Merge duplicate/shared walls ────────────────────────────────────────────

/**
 * After building all room walls, merge walls that are collinear and
 * overlapping/touching (within MERGE_TOLERANCE_CM). This eliminates the
 * double-wall that appears between every pair of adjacent rooms.
 */
function mergeWalls(walls: WallData[]): WallData[] {
  // Separate horizontal (y1 ≈ y2) from vertical (x1 ≈ x2) walls
  const horizontal: WallData[] = []
  const vertical:   WallData[] = []

  for (const w of walls) {
    if (Math.abs(w.y1 - w.y2) < 1) horizontal.push(w)
    else                              vertical.push(w)
  }

  const mergedH = mergeAxisWalls(horizontal, 'horizontal')
  const mergedV = mergeAxisWalls(vertical,   'vertical')

  return [...mergedH, ...mergedV]
}

/**
 * Group walls by their fixed coordinate (y for horizontal, x for vertical),
 * then within each group merge any overlapping/touching segments.
 */
function mergeAxisWalls(walls: WallData[], axis: 'horizontal' | 'vertical'): WallData[] {
  if (walls.length === 0) return []

  // Key = rounded fixed coordinate (within MERGE_TOLERANCE_CM bucket)
  const groups = new Map<number, WallData[]>()

  for (const w of walls) {
    const fixed = axis === 'horizontal'
      ? Math.round((w.y1 + w.y2) / 2)
      : Math.round((w.x1 + w.x2) / 2)

    // Find an existing group whose key is within tolerance
    let groupKey: number | undefined
    for (const key of groups.keys()) {
      if (Math.abs(key - fixed) <= MERGE_TOLERANCE_CM) {
        groupKey = key
        break
      }
    }
    if (groupKey === undefined) {
      groups.set(fixed, [w])
    } else {
      groups.get(groupKey)!.push(w)
    }
  }

  const result: WallData[] = []

  for (const group of groups.values()) {
    // Convert each wall to a [min, max] span along the variable axis
    type Seg = { min: number; max: number; wall: WallData }
    const segs: Seg[] = group.map(w =>
      axis === 'horizontal'
        ? { min: Math.min(w.x1, w.x2), max: Math.max(w.x1, w.x2), wall: w }
        : { min: Math.min(w.y1, w.y2), max: Math.max(w.y1, w.y2), wall: w }
    )

    // Sort by start of span
    segs.sort((a, b) => a.min - b.min)

    // Merge overlapping/touching segments
    const merged: Seg[] = [segs[0]]
    for (let i = 1; i < segs.length; i++) {
      const last = merged[merged.length - 1]
      if (segs[i].min <= last.max + MERGE_TOLERANCE_CM) {
        // Overlapping or touching — extend the current span
        last.max = Math.max(last.max, segs[i].max)
      } else {
        merged.push(segs[i])
      }
    }

    // Rebuild WallData from merged segments, using the fixed axis value of the group
    const fixedVal = axis === 'horizontal'
      ? (group[0].y1 + group[0].y2) / 2
      : (group[0].x1 + group[0].x2) / 2

    for (const seg of merged) {
      const w = seg.wall
      if (axis === 'horizontal') {
        result.push({ ...w, x1: seg.min, y1: fixedVal, x2: seg.max, y2: fixedVal })
      } else {
        result.push({ ...w, x1: fixedVal, y1: seg.min, x2: fixedVal, y2: seg.max })
      }
    }
  }

  return result
}

// ─── rooms → FloorPlanData ────────────────────────────────────────────────

/**
 * Convert a list of rooms (rectangular) into FloorPlanData walls + openings.
 * Wall IDs encode the room ID + side so the reverse pass can reconstruct rooms.
 *   ID pattern: `{roomId}-T` | `-B` | `-L` | `-R`
 *
 * Shared walls between adjacent rooms are merged into a single wall.
 */
export function roomsToFloorPlan(rooms: RoomShape[]): FloorPlanData {
  // Fix AI coordinate imprecision: snap room edges that are nearly touching
  const snappedRooms = snapRoomsToSharedEdges(rooms)

  const walls: WallData[] = []
  const openings: OpeningData[] = []
  const roomMeta: Record<string, { name: string }> = {}

  for (const room of snappedRooms) {
    const { id, position_x: px, position_y: py, width_cm: w, depth_cm: d } = room
    roomMeta[id] = { name: room.name }

    const ids = { T: `${id}-T`, B: `${id}-B`, L: `${id}-L`, R: `${id}-R` }

    walls.push({ id: ids.T, x1: px,     y1: py,     x2: px + w, y2: py,     thickness: WALL_THICKNESS_CM })
    walls.push({ id: ids.B, x1: px,     y1: py + d, x2: px + w, y2: py + d, thickness: WALL_THICKNESS_CM })
    walls.push({ id: ids.L, x1: px,     y1: py,     x2: px,     y2: py + d, thickness: WALL_THICKNESS_CM })
    walls.push({ id: ids.R, x1: px + w, y1: py,     x2: px + w, y2: py + d, thickness: WALL_THICKNESS_CM })

    // Doors
    for (const door of room.doors ?? []) {
      const wallId = { top: ids.T, bottom: ids.B, left: ids.L, right: ids.R }[door.wall]
      if (!wallId) continue
      const wallLen = (door.wall === 'top' || door.wall === 'bottom') ? w : d
      const midPoint = door.x + door.width / 2
      const position = Math.min(0.99, Math.max(0.01, midPoint / wallLen))
      openings.push({
        id: `${id}-door-${door.wall}-${door.x}`,
        wallId,
        type: 'door',
        position,
        width: door.width,
        direction: 1,
      })
    }

    // Windows
    for (const win of room.windows ?? []) {
      const wallId = { top: ids.T, bottom: ids.B, left: ids.L, right: ids.R }[win.wall]
      if (!wallId) continue
      const wallLen = (win.wall === 'top' || win.wall === 'bottom') ? w : d
      const midPoint = win.x + win.width / 2
      const position = Math.min(0.99, Math.max(0.01, midPoint / wallLen))
      openings.push({
        id: `${id}-win-${win.wall}-${win.x}`,
        wallId,
        type: 'window',
        position,
        width: win.width,
      })
    }
  }

  // Merge duplicate/shared walls so adjacent rooms share one wall instead of two
  const mergedWalls = mergeWalls(walls)

  return {
    version: 1,
    walls: mergedWalls,
    openings,
    furniture: [],
    metadata: { rooms: roomMeta },
  }
}

// ─── FloorPlanData → rooms ─────────────────────────────────────────────────

/**
 * Parse FloorPlanData back into rooms.
 * Only reconstructs rooms whose walls match the `{roomId}-T/B/L/R` ID pattern.
 * Walls drawn freely by the user (no ID pattern) are ignored for room extraction
 * — they are preserved in the planner_state JSON but won't update the rooms table.
 */
export function floorPlanToRooms(data: FloorPlanData): RoomShape[] {
  const roomWalls = new Map<string, Record<string, WallData>>()
  const roomNames = (data.metadata?.rooms ?? {}) as Record<string, { name: string }>

  for (const wall of data.walls) {
    const match = wall.id.match(/^(.+)-([TBLR])$/)
    if (!match) continue
    const [, roomId, side] = match
    if (!roomWalls.has(roomId)) roomWalls.set(roomId, {})
    roomWalls.get(roomId)![side] = wall
  }

  const rooms: RoomShape[] = []

  for (const [roomId, w] of roomWalls) {
    const T = w['T'], B = w['B'], L = w['L'], R = w['R']
    if (!T || !B || !L || !R) continue

    const minX = Math.min(T.x1, T.x2, L.x1, L.x2)
    const maxX = Math.max(T.x1, T.x2, R.x1, R.x2)
    const minY = Math.min(T.y1, T.y2, L.y1, L.y2)
    const maxY = Math.max(B.y1, B.y2, L.y1, L.y2)

    const width_cm = Math.round(maxX - minX)
    const depth_cm  = Math.round(maxY - minY)

    // Collect openings that belong to this room's walls
    const wallIdSet = new Set([T.id, B.id, L.id, R.id])
    const sideOf: Record<string, string> = { [T.id]: 'top', [B.id]: 'bottom', [L.id]: 'left', [R.id]: 'right' }
    const doors:   RoomShape['doors']   = []
    const windows: RoomShape['windows'] = []

    for (const opening of data.openings) {
      if (!wallIdSet.has(opening.wallId)) continue
      const side = sideOf[opening.wallId]
      const wallLen = (side === 'top' || side === 'bottom') ? width_cm : depth_cm
      const centerCm = opening.position * wallLen
      const x = Math.round(Math.max(0, centerCm - opening.width / 2))
      if (opening.type === 'door') {
        doors.push({ x, width: Math.round(opening.width), wall: side })
      } else {
        windows.push({ x, width: Math.round(opening.width), wall: side })
      }
    }

    rooms.push({
      id: roomId,
      name: roomNames[roomId]?.name ?? 'Room',
      width_cm,
      depth_cm,
      position_x: Math.round(minX),
      position_y: Math.round(minY),
      doors,
      windows,
    })
  }

  return rooms
}
