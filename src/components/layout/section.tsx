import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  narrow?: boolean
}

export function Section({ children, className, narrow, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'px-6 py-20',
        narrow ? 'mx-auto max-w-4xl' : 'mx-auto max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('mb-12', className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-lg text-stone-500">{subtitle}</p>
      )}
    </div>
  )
}
