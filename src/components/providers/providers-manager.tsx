'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Provider {
  id: string
  name: string
  website: string | null
  is_active: boolean
}

export function ProvidersManager({ providers }: { providers: Provider[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('providers').insert({ name: name.trim(), website: website.trim() || null })
    setName('')
    setWebsite('')
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('providers').update({ is_active: !current }).eq('id', id)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this provider? This will not delete associated furniture items.')) return
    const supabase = createClient()
    await supabase.from('providers').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-4">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            + Add Provider
          </button>
        ) : (
          <form onSubmit={handleAdd} className="flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Provider Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. IKEA"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.ikea.com" type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {providers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No providers yet. Add IKEA, Wayfair, Amazon, or custom providers.
                </td>
              </tr>
            ) : (
              providers.map(provider => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{provider.name}</td>
                  <td className="px-4 py-3">
                    {provider.website ? (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs">{provider.website}</a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(provider.id, provider.is_active)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        provider.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {provider.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(provider.id)}
                      className="text-xs text-red-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
