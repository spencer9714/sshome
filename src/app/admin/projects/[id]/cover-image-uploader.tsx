'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { updateCoverImage } from '../actions'
import { getImageUrl } from '@/lib/utils'

interface CoverImageUploaderProps {
  projectId: string
  currentPath: string | null
}

export function CoverImageUploader({ projectId, currentPath }: CoverImageUploaderProps) {
  const [path, setPath] = useState(currentPath)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filePath = `${projectId}/cover.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      await updateCoverImage(projectId, filePath)
      setPath(filePath)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {path && (
        <div className="relative mb-4 aspect-video w-full max-w-lg overflow-hidden rounded-xl bg-stone-100">
          <Image
            src={getImageUrl(path)}
            alt="Cover image"
            fill
            className="object-cover"
            sizes="512px"
          />
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50">
        {uploading ? 'Uploading...' : path ? 'Replace Cover' : 'Upload Cover Image'}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  )
}
