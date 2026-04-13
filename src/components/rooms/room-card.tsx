'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Room {
  id: string
  name: string
  width_cm: number
  depth_cm: number
  doors: unknown[]
  windows: unknown[]
}

export function RoomCard({ room, floorId }: { room: Room; floorId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('rooms').delete().eq('id', room.id)
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          {room.name.toLowerCase().includes('bedroom') || room.name.toLowerCase().includes('臥') ? '🛏️'
            : room.name.toLowerCase().includes('living') || room.name.toLowerCase().includes('客廳') ? '🛋️'
            : room.name.toLowerCase().includes('kitchen') || room.name.toLowerCase().includes('廚') ? '🍳'
            : room.name.toLowerCase().includes('bathroom') || room.name.toLowerCase().includes('浴') ? '🚿'
            : room.name.toLowerCase().includes('dining') || room.name.toLowerCase().includes('餐') ? '🍽️'
            : room.name.toLowerCase().includes('office') || room.name.toLowerCase().includes('辦') ? '💼'
            : '🚪'}
        </div>
        <div>
          <p className="font-medium text-gray-900">{room.name}</p>
          <p className="text-xs text-gray-400">
            {(room.width_cm / 100).toFixed(1)}m × {(room.depth_cm / 100).toFixed(1)}m
            {' · '}{room.doors.length} door{room.doors.length !== 1 ? 's' : ''}
            {' · '}{room.windows.length} window{room.windows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {confirmDelete ? (
          <>
            <button onClick={handleDelete} disabled={deleting}
              className="rounded-lg bg-red-600 px-2.5 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50">
              {deleting ? '...' : 'Delete'}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors">
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
