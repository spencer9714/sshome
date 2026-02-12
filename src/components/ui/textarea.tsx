import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900',
            'placeholder:text-stone-400',
            'focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none',
            'disabled:bg-stone-50 disabled:text-stone-500',
            'min-h-[80px] resize-y',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export { Textarea }
