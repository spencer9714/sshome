'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FURNITURE_CATEGORIES, STYLE_OPTIONS } from '@/lib/constants'

interface Provider { id: string; name: string }

export function AddFurnitureButton({ providers }: { providers: Provider[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  const [form, setForm] = useState({
    name: '', category: FURNITURE_CATEGORIES[0], provider_id: '',
    width_cm: 100, depth_cm: 80, height_cm: 75,
    price: 0, currency: 'USD', image_url: '', product_url: '',
  })

  const toggleStyle = (style: string) =>
    setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: dbError } = await supabase.from('furniture_items').insert({
      ...form,
      provider_id: form.provider_id || null,
      image_url: form.image_url || null,
      product_url: form.product_url || null,
      style_tags: selectedStyles,
    })

    if (dbError) { setError(dbError.message); setLoading(false); return }
    setOpen(false)
    router.refresh()
  }

  const f = (field: string, value: string | number) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
        + Add Furniture
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Furniture Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                  <input value={form.name} onChange={e => f('name', e.target.value)} required
                    placeholder="e.g. IKEA EKTORP Sofa"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e => f('category', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    {FURNITURE_CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                <select value={form.provider_id} onChange={e => f('provider_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">No provider</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[['Width (cm)', 'width_cm'], ['Depth (cm)', 'depth_cm'], ['Height (cm)', 'height_cm']].map(([label, field]) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                    <input type="number" value={form[field as keyof typeof form] as number}
                      onChange={e => f(field, Number(e.target.value))} min={1} required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" value={form.price} onChange={e => f('price', Number(e.target.value))} min={0} step={0.01} required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                  <select value={form.currency} onChange={e => f('currency', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    {['USD', 'TWD', 'CAD', 'AUD', 'EUR', 'GBP'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Style Tags</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map(style => (
                    <button key={style} type="button" onClick={() => toggleStyle(style)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedStyles.includes(style)
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product URL</label>
                <input value={form.product_url} onChange={e => f('product_url', e.target.value)} type="url"
                  placeholder="https://www.ikea.com/..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
