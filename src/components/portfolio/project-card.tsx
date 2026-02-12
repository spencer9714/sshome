import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/lib/utils'
import type { Project } from '@/lib/types/database'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={getImageUrl(project.cover_image_path)}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-stone-900 group-hover:text-stone-700">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          {project.city}, {project.state}
          {project.bedrooms && project.bathrooms && (
            <span>
              {' '}&middot; {project.bedrooms}B{project.bathrooms}B
            </span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.style_tags.map((tag) => (
            <Badge key={tag} variant="warm">{tag}</Badge>
          ))}
          {project.goal && <Badge variant="sage">{project.goal}</Badge>}
        </div>
      </div>
    </Link>
  )
}
