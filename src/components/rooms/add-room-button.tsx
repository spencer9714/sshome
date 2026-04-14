'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ROOM_TYPES, WALL_POSITIONS } from '@/lib/constants'
import { FtInchInput } from '@/components/ui/ft-inch-input'
import { formatFtInch, US_DOOR_DEFAULT_CM } from '@/lib/units'

interface Door {
  x: number
  y: number
  width: number
  wall: string
}

interface Window {
  x: number
  y: number
  width: number
  wall: string
}

export function AddRoomButton({ floorId, className }: { floorId: string; className?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState<string>(ROOM_TYPES[0])
  const [customName, setCustomName] = useState('')
  const [widthCm, setWidthCm] = useState(400)
  const [depthCm, setDepthCm] = useState(350)
  const [doors, setDoors] = useState<Door[]>([{ x: 100, y: 0, width: US_DOOR_DEFAULT_CM, wall: 'top' }])
  const [windows, setWindows] = useState<Window[]>([])

  const addDoor = () => setDoors([...doors, { x: 0, y: 0, width: 90, wall: 'top' }])
  const removeDoor = (i: number) => setDoors(doors.filter((_, idx) => idx !== i))
  const updateDoor = (i: number, field: keyof Door, value: string | number) =>
    setDoors(doors.map((d, idx) => idx === i ? { ...d, [field]: value } : d))

  const addWindow = () => setWindows([...windows, { x: 0, y: 0, width: 120, wall: 'right' }])
  const removeWindow = (i: number) => setWindows(windows.filter((_, idx) => idx !== i))
  const updateWindow = (i: number, field: keyof Window, value: string | number) =>
    setWindows(windows.map((w, idx) => idx === i ? { ...w, [field]: value } : w))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const roomName = name === 'Other' ? customName.trim() : name
    if (!roomName) { setError('Room name is required'); setLoading(false); return }

    const supabase = createClient()
    const { error: dbError } = await supabase.from('rooms').insert({
      floor_id: floorId,
      name: roomName,
      width_cm: widthCm,
      depth_cm: depthCm,
      doors,
      windows,
    })

    if (dbError) { setError(dbError.message); setLoading(false); return }

    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors ${className ?? ''}`}
      >
        + Add Room
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {name === 'Other' && (
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Custom room name"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Dimensions — ft/inch inputs */}
              <div className="flex flex-wrap gap-4">
                <FtInchInput
                  label="Width *"
                  valueCm={widthCm}
                  onChangeCm={setWidthCm}
                  min={30}
                />
                <FtInchInput
                  label="Depth *"
                  valueCm={depthCm}
                  onChangeCm={setDepthCm}
                  min={30}
                />
              </div>
              <p className="text-xs text-gray-400">{formatFtInch(widthCm)} × {formatFtInch(depthCm)}</p>

              {/* Doors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Doors</label>
                  <button type="button" onClick={addDoor} className="text-xs text-blue-600 hover:underline">+ Add door</button>
                </div>
                {doors.map((door, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <select value={door.wall} onChange={(e) => updateDoor(i, 'wall', e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs">
                      {WALL_POSITIONS.map(w => <option key={w}>{w}</option>)}
                    </select>
                    <input type="number" value={door.x} onChange={(e) => updateDoor(i, 'x', Number(e.target.value))}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-xs" placeholder="X cm" title="Offset from wall corner (cm)" />
                    <span className="text-xs text-gray-500">{formatFtInch(door.width)} wide</span>
                    <input type="number" value={door.width} onChange={(e) => updateDoor(i, 'width', Number(e.target.value))}
                      className="w-14 rounded border border-gray-300 px-2 py-1 text-xs" placeholder="cm" title="Door width (cm)" />
                    <button type="button" onClick={() => removeDoor(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>

              {/* Windows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Windows</label>
                  <button type="button" onClick={addWindow} className="text-xs text-blue-600 hover:underline">+ Add window</button>
                </div>
                {windows.map((win, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <select value={win.wall} onChange={(e) => updateWindow(i, 'wall', e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs">
                      {WALL_POSITIONS.map(w => <option key={w}>{w}</option>)}
                    </select>
                    <input type="number" value={win.x} onChange={(e) => updateWindow(i, 'x', Number(e.target.value))}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-xs" placeholder="X cm" title="Offset from wall corner (cm)" />
                    <span className="text-xs text-gray-500">{formatFtInch(win.width)} wide</span>
                    <input type="number" value={win.width} onChange={(e) => updateWindow(i, 'width', Number(e.target.value))}
                      className="w-14 rounded border border-gray-300 px-2 py-1 text-xs" placeholder="cm" title="Window width (cm)" />
                    <button type="button" onClick={() => removeWindow(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
