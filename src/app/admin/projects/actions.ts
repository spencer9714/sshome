'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function createProject(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const title = (formData.get('title') as string)?.trim()
  const customSlug = (formData.get('slug') as string)?.trim()
  const slug = customSlug || slugify(title)
  const city = (formData.get('city') as string)?.trim()
  const property_type = (formData.get('property_type') as string) || ''
  const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : null
  const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : null
  const style_tags = formData.getAll('style_tags') as string[]
  const budget_range = (formData.get('budget_range') as string) || null
  const goal = (formData.get('goal') as string) || null
  const summary = (formData.get('summary') as string)?.trim() || null
  const what_we_did = (formData.get('what_we_did') as string)?.trim() || null
  const design_notes = (formData.get('design_notes') as string)?.trim() || null
  const timeline_weeks = formData.get('timeline_weeks') ? Number(formData.get('timeline_weeks')) : null

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      slug,
      city,
      property_type,
      bedrooms,
      bathrooms,
      style_tags,
      budget_range,
      goal,
      summary,
      what_we_did,
      design_notes,
      timeline_weeks,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  redirect(`/admin/projects/${data.id}`)
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const title = (formData.get('title') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const property_type = (formData.get('property_type') as string) || ''
  const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : null
  const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : null
  const style_tags = formData.getAll('style_tags') as string[]
  const budget_range = (formData.get('budget_range') as string) || null
  const goal = (formData.get('goal') as string) || null
  const summary = (formData.get('summary') as string)?.trim() || null
  const what_we_did = (formData.get('what_we_did') as string)?.trim() || null
  const design_notes = (formData.get('design_notes') as string)?.trim() || null
  const timeline_weeks = formData.get('timeline_weeks') ? Number(formData.get('timeline_weeks')) : null
  const is_published = formData.get('is_published') === 'true'

  const { error } = await supabase
    .from('projects')
    .update({
      title,
      slug,
      city,
      property_type,
      bedrooms,
      bathrooms,
      style_tags,
      budget_range,
      goal,
      summary,
      what_we_did,
      design_notes,
      timeline_weeks,
      is_published,
    })
    .eq('id', projectId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath('/portfolio')
  revalidatePath(`/portfolio/${slug}`)
}

export async function deleteProject(projectId: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('projects').delete().eq('id', projectId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/projects')
  redirect('/admin/projects')
}

export async function updateCoverImage(projectId: string, path: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('projects')
    .update({ cover_image_path: path })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function addProjectImage(
  projectId: string,
  path: string,
  sortOrder: number
) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('project_images').insert({
    project_id: projectId,
    path,
    sort_order: sortOrder,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function updateProjectImage(
  imageId: string,
  data: {
    caption?: string | null
    space?: string | null
    is_before?: boolean
    is_after?: boolean
    sort_order?: number
  }
) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('project_images')
    .update(data)
    .eq('id', imageId)

  if (error) throw new Error(error.message)
}

export async function deleteProjectImage(imageId: string, storagePath: string) {
  const supabase = await createServerSupabaseClient()

  // Delete from database
  const { error: dbError } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId)

  if (dbError) throw new Error(dbError.message)

  // Delete from storage (best effort)
  await supabase.storage.from('portfolio').remove([storagePath])
}

export async function reorderImages(updates: { id: string; sort_order: number }[]) {
  const supabase = await createServerSupabaseClient()

  for (const update of updates) {
    await supabase
      .from('project_images')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id)
  }
}
