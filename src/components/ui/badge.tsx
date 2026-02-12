import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'warm' | 'sage' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700',
  warm: 'bg-warm-100 text-warm-700',
  sage: 'bg-sage-100 text-sage-700',
  outline: 'border border-stone-300 text-stone-600',
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
