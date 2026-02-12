import { createProject } from '../actions'
import { ProjectForm } from '../project-form'

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">New Project</h1>
      <p className="mt-1 text-sm text-stone-500">Create a new portfolio project.</p>

      <div className="mt-8">
        <ProjectForm onSubmit={createProject} />
      </div>
    </div>
  )
}
