import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: furnitureCount },
    { count: providerCount },
    { count: propertyCount },
  ] = await Promise.all([
    supabase.from('furniture_items').select('*', { count: 'exact', head: true }),
    supabase.from('providers').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage furniture catalog, providers, and platform data.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Furniture Items', value: furnitureCount ?? 0, href: '/admin/furniture' },
          { label: 'Providers', value: providerCount ?? 0, href: '/admin/providers' },
          { label: 'Total Properties', value: propertyCount ?? 0, href: '#' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 transition-colors">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
