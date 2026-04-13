import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'

interface AppSidebarProps {
  userEmail: string
  isAdmin: boolean
}

export function AppSidebar({ userEmail, isAdmin }: AppSidebarProps) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="text-lg font-bold text-gray-900">
          Furnish<span className="text-blue-600">AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <span>🏠</span> Properties
        </Link>
        <Link href="/catalog" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <span>🛋️</span> Furniture Catalog
        </Link>
        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</p>
            </div>
            <Link href="/admin/furniture" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span>✏️</span> Manage Furniture
            </Link>
            <Link href="/admin/providers" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span>🏪</span> Providers
            </Link>
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 truncate px-3 mb-2">{userEmail}</p>
        <LogoutButton />
      </div>
    </aside>
  )
}
