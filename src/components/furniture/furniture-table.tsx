'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FURNITURE_CATEGORY_LABELS } from '@/lib/constants'

interface FurnitureItem {
  id: string
  name: string
  category: string
  width_cm: number
  depth_cm: number
  height_cm: number | null
  price: number
  currency: string
  style_tags: string[]
  is_active: boolean
  providers: { name: string } | null
  product_url: string | null
}

interface Provider { id: string; name: string }

export function FurnitureTable({ items, providers }: { items: FurnitureItem[]; providers: Provider[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = items.filter(item => {
    const matchText = !filter || item.name.toLowerCase().includes(filter.toLowerCase())
    const matchCat = !categoryFilter || item.category === categoryFilter
    return matchText && matchCat
  })

  const categories = [...new Set(items.map(i => i.category))].sort()

  const handleToggle = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('furniture_items').update({ is_active: !current }).eq('id', id)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this furniture item?')) return
    const supabase = createClient()
    await supabase.from('furniture_items').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search by name..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none w-64"
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{FURNITURE_CATEGORY_LABELS[c] ?? c}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Size (cm)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Styles</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No furniture items found</td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${!item.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.product_url && (
                      <a href={item.product_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline">View product ↗</a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{FURNITURE_CATEGORY_LABELS[item.category] ?? item.category}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {item.width_cm} × {item.depth_cm}{item.height_cm ? ` × ${item.height_cm}` : ''}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.currency} ${item.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{item.providers?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.style_tags.slice(0, 2).map(tag => (
                        <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{tag}</span>
                      ))}
                      {item.style_tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{item.style_tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(item.id, item.is_active)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(item.id)}
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
