import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { updateProject, deleteProject } from '../actions'
import { ProjectForm } from '../project-form'
import { ImageManager } from './image-manager'
import { CoverImageUploader } from './cover-image-uploader'
import { Button } from '@/components/ui/button'
import type { Project, ProjectImage } from '@/lib/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  const project = projectData as Project | null
  if (!project) notFound()

  const { data: imagesData } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', id)
    .order('sort_order', { ascending: true })

  const images = (imagesData ?? []) as ProjectImage[]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">
            Edit: {project.title}
          </h1>
        </div>
        <div className="flex gap-3">
          {project.is_published && (
            <Link href={`/portfolio/${project.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                View Live
              </Button>
            </Link>
          )}
          <form action={async () => {
            'use server'
            await deleteProject(id)
          }}>
            <Button variant="danger" size="sm" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {/* Project Details */}
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-6">Project Details</h2>
          <ProjectForm
            project={project}
            onSubmit={async (formData) => {
              'use server'
              await updateProject(id, formData)
            }}
          />
        </section>

        {/* Cover Image */}
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-6">Cover Image</h2>
          <CoverImageUploader
            projectId={project.id}
            currentPath={project.cover_image_path}
          />
        </section>

        {/* Gallery */}
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-6">Gallery</h2>
          <ImageManager
            projectId={project.id}
            initialImages={images}
          />
        </section>
      </div>
    </div>
  )
}
