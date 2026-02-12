import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: projectCount },
    { count: publishedCount },
    { count: leadCount },
    { count: newLeadCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('internal_status', 'new'),
  ])

  const stats = [
    { label: 'Total Projects', value: projectCount ?? 0 },
    { label: 'Published', value: publishedCount ?? 0 },
    { label: 'Total Leads', value: leadCount ?? 0 },
    { label: 'New Leads', value: newLeadCount ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">Overview of your projects and leads.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
