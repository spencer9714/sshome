import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar userEmail={user.email!} isAdmin={profile?.role === 'admin'} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
