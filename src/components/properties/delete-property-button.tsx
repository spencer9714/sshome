'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DeletePropertyButton({ propertyId, propertyName }: { propertyId: string; propertyName: string }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', propertyId)
    router.push('/dashboard')
    router.refresh()
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete &quot;{propertyName}&quot;?</span>
        <button onClick={handleDelete} disabled={loading} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50">
          {loading ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button onClick={() => setConfirm(false)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
    >
      Delete
    </button>
  )
}
