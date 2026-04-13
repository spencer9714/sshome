'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AddFloorButtonProps {
  propertyId: string
  nextFloorNumber: number
  className?: string
}

export function AddFloorButton({ propertyId, nextFloorNumber, className }: AddFloorButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('floors')
      .insert({ property_id: propertyId, floor_number: nextFloorNumber })
      .select()
      .single()

    if (!error && data) {
      router.push(`/properties/${propertyId}/floors/${data.id}`)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors ${className ?? ''}`}
    >
      {loading ? 'Adding...' : `+ Add Floor ${nextFloorNumber}`}
    </button>
  )
}
