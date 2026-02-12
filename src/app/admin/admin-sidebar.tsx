'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/projects', label: 'Projects', icon: 'image' },
  { href: '/admin/leads', label: 'Leads', icon: 'inbox' },
]

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'grid':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      )
    case 'image':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      )
    case 'inbox':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
        </svg>
      )
    default:
      return null
  }
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex w-64 flex-col border-r border-stone-200 bg-white">
      <div className="border-b border-stone-100 px-6 py-5">
        <Link href="/admin" className="text-lg font-semibold text-stone-900">
          SSHome<span className="font-light text-stone-400"> Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {ADMIN_LINKS.map((link) => {
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  )}
                >
                  <NavIcon icon={link.icon} />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-stone-100 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-900"
        >
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-900"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
