import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ProjectsFilter } from './projects-filter'
import type { Project } from '@/lib/types/database'

export default async function AdminProjectsPage() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  const projects = (data ?? []) as Project[]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Projects</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your portfolio projects.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      <ProjectsFilter projects={projects} />
    </div>
  )
}
