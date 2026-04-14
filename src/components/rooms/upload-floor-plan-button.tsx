'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { WALL_POSITIONS } from '@/lib/constants'
import type { ExtractedRoom } from '@/app/api/floors/analyze/route'
import { FtInchInput } from '@/components/ui/ft-inch-input'
import { formatFtInch } from '@/lib/units'

interface UploadFloorPlanButtonProps {
  floorId: string
  className?: string
}

export function UploadFloorPlanButton({ floorId, className }: UploadFloorPlanButtonProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'idle' | 'analyzing' | 'review' | 'saving'>('idle')
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [rooms, setRooms] = useState<ExtractedRoom[]>([])
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setStep('analyzing')
    setError('')

    const formData = new FormData()
    formData.append('image', file)
    formData.append('floorId', floorId)

    const res = await fetch('/api/floors/analyze', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Analysis failed')
      setStep('idle')
      return
    }

    setRooms(data.rooms)
    setStep('review')
  }

  const updateRoom = (i: number, field: keyof ExtractedRoom, value: unknown) =>
    setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))

  const removeRoom = (i: number) =>
    setRooms(prev => prev.filter((_, idx) => idx !== i))

  const addRoom = () =>
    setRooms(prev => [...prev, {
      name: 'New Room', width_cm: 300, depth_cm: 300,
      position_x: 0, position_y: 0, doors: [], windows: [],
    }])

  const handleSave = async () => {
    setStep('saving')
    const supabase = createClient()

    const inserts = rooms.map(r => ({
      floor_id: floorId,
      name: r.name,
      width_cm: r.width_cm,
      depth_cm: r.depth_cm,
      position_x: r.position_x,
      position_y: r.position_y,
      doors: r.doors,
      windows: r.windows,
    }))

    const { error: dbError } = await supabase.from('rooms').insert(inserts)
    if (dbError) { setError(dbError.message); setStep('review'); return }

    setOpen(false)
    router.refresh()
  }

  const handleClose = () => {
    setOpen(false)
    setStep('idle')
    setPreview(null)
    setRooms([])
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors ${className ?? ''}`}
      >
        AI Analyze Floor Plan
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Analyze Floor Plan</h2>
                <p className="text-xs text-gray-400 mt-0.5">Upload an image — AI will extract all rooms automatically</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">✕</button>
            </div>

            <div className="p-6">
              {/* Step 1: Upload */}
              {(step === 'idle' || step === 'analyzing') && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    {preview ? (
                      <img src={preview} alt="Floor plan" className="max-h-64 mx-auto rounded-lg object-contain" />
                    ) : (
                      <>
                        <div className="text-5xl mb-3">🏠</div>
                        <p className="font-medium text-gray-700">Click to upload floor plan</p>
                        <p className="text-sm text-gray-400 mt-1">PNG, JPG, or WEBP</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {step === 'analyzing' && (
                    <div className="rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin shrink-0" />
                      <p className="text-sm text-purple-700 font-medium">Claude is analyzing your floor plan...</p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                  )}
                </div>
              )}

              {/* Step 2: Review */}
              {(step === 'review' || step === 'saving') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-semibold text-purple-700">{rooms.length} rooms</span>. Review and edit before saving.
                    </p>
                    <button onClick={addRoom} className="text-xs text-blue-600 hover:underline">+ Add room</button>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {rooms.map((room, i) => (
                      <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            type="text"
                            value={room.name}
                            onChange={e => updateRoom(i, 'name', e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium focus:border-purple-500 focus:outline-none"
                          />
                          <button onClick={() => removeRoom(i)} className="text-red-400 hover:text-red-600 text-xs shrink-0">Remove</button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <FtInchInput
                            label="Width"
                            valueCm={room.width_cm}
                            onChangeCm={v => updateRoom(i, 'width_cm', v)}
                            min={30}
                          />
                          <FtInchInput
                            label="Depth"
                            valueCm={room.depth_cm}
                            onChangeCm={v => updateRoom(i, 'depth_cm', v)}
                            min={30}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {formatFtInch(room.width_cm)} × {formatFtInch(room.depth_cm)}
                          {' · '}{room.doors.length} door{room.doors.length !== 1 ? 's' : ''}
                          {' · '}{room.windows.length} window{room.windows.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setStep('idle'); setRooms([]) }}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Re-upload
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={step === 'saving' || rooms.length === 0}
                      className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                      {step === 'saving' ? 'Saving...' : `Save ${rooms.length} Rooms`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
