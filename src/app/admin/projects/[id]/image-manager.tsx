'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'
import {
  addProjectImage,
  updateProjectImage,
  deleteProjectImage,
  reorderImages,
} from '../actions'
import { getImageUrl } from '@/lib/utils'
import { SPACE_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ProjectImage } from '@/lib/types/database'

interface ImageManagerProps {
  projectId: string
  initialImages: ProjectImage[]
}

export function ImageManager({ projectId, initialImages }: ImageManagerProps) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setUploading(true)
      const supabase = createClient()
      const startOrder = images.length

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const ext = file.name.split('.').pop()
          const uuid = crypto.randomUUID()
          const filePath = `${projectId}/${uuid}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Upload error:', uploadError)
            continue
          }

          await addProjectImage(projectId, filePath, startOrder + i)

          setImages((prev) => [
            ...prev,
            {
              id: uuid,
              project_id: projectId,
              path: filePath,
              caption: null,
              space: null,
              sort_order: startOrder + i,
              is_before: false,
              is_after: false,
              created_at: new Date().toISOString(),
            },
          ])
        }
      } finally {
        setUploading(false)
        // Reset input
        e.target.value = ''
      }
    },
    [projectId, images.length]
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)

    const newImages = [...images]
    const [moved] = newImages.splice(oldIndex, 1)
    newImages.splice(newIndex, 0, moved)

    // Update sort_order
    const updated = newImages.map((img, i) => ({ ...img, sort_order: i }))
    setImages(updated)

    await reorderImages(updated.map((img) => ({ id: img.id, sort_order: img.sort_order })))
  }

  const handleUpdate = async (
    imageId: string,
    field: string,
    value: string | boolean
  ) => {
    await updateProjectImage(imageId, { [field]: value })
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, [field]: value } : img))
    )
  }

  const handleDelete = async (image: ProjectImage) => {
    if (!confirm('Delete this image?')) return

    await deleteProjectImage(image.id, image.path)
    setImages((prev) => prev.filter((img) => img.id !== image.id))
  }

  return (
    <div>
      {/* Upload */}
      <div className="mb-6">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50">
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
        <p className="mt-1 text-xs text-stone-400">
          Drag to reorder. Click on an image to edit details.
        </p>
      </div>

      {/* Sortable Grid */}
      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  isEditing={editingId === image.id}
                  onToggleEdit={() =>
                    setEditingId(editingId === image.id ? null : image.id)
                  }
                  onUpdate={handleUpdate}
                  onDelete={() => handleDelete(image)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-stone-200 py-12 text-center text-stone-400">
          No images yet. Upload some images to build the gallery.
        </div>
      )}
    </div>
  )
}

function SortableImage({
  image,
  isEditing,
  onToggleEdit,
  onUpdate,
  onDelete,
}: {
  image: ProjectImage
  isEditing: boolean
  onToggleEdit: () => void
  onUpdate: (id: string, field: string, value: string | boolean) => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative rounded-xl border border-stone-200 bg-white overflow-hidden',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="relative aspect-square cursor-grab bg-stone-100"
        onClick={onToggleEdit}
      >
        <Image
          src={getImageUrl(image.path)}
          alt={image.caption || 'Gallery image'}
          fill
          className="object-cover"
          sizes="200px"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {image.is_before && (
            <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              BEFORE
            </span>
          )}
          {image.is_after && (
            <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              AFTER
            </span>
          )}
        </div>
        {image.space && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
              {image.space}
            </span>
          </div>
        )}
      </div>

      {/* Edit panel */}
      {isEditing && (
        <div className="p-3 space-y-2 border-t border-stone-100">
          <input
            type="text"
            placeholder="Caption"
            defaultValue={image.caption ?? ''}
            onBlur={(e) => onUpdate(image.id, 'caption', e.target.value)}
            className="w-full rounded border border-stone-200 px-2 py-1 text-xs"
          />
          <select
            defaultValue={image.space ?? ''}
            onChange={(e) => onUpdate(image.id, 'space', e.target.value)}
            className="w-full rounded border border-stone-200 px-2 py-1 text-xs"
          >
            <option value="">Space...</option>
            {SPACE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex gap-3 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={image.is_before}
                onChange={(e) => onUpdate(image.id, 'is_before', e.target.checked)}
              />
              Before
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={image.is_after}
                onChange={(e) => onUpdate(image.id, 'is_after', e.target.checked)}
              />
              After
            </label>
          </div>
          <button
            onClick={onDelete}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete image
          </button>
        </div>
      )}
    </div>
  )
}
