'use client'

import { useEffect, useState } from 'react'
import { getSetupProductOptions } from '@/admin/setup-product-actions'
import type { SetupProductOption } from '@/lib/setup-products'

export function useSetupProductOptions() {
  const [products, setProducts] = useState<SetupProductOption[]>([])
  const [productsLoading, setLoading] = useState(true)
  const [productsError, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const result = await getSetupProductOptions()
        if (!active) return
        if (result.error) setError(result.error)
        else setProducts(result.products || [])
      } catch {
        if (active) setError('Could not load products. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [attempt])
  function retryProducts() {
    setError('')
    setLoading(true)
    setAttempt(value => value + 1)
  }
  return { products, productsLoading, productsError, retryProducts }
}

export default function SetupProductSelect({
  products, selectedIds, onChange, disabled, loading, error, onRetry,
}: {
  products: SetupProductOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  disabled: boolean
  loading: boolean
  error: string
  onRetry: () => void
}) {
  const [search, setSearch] = useState('')
  const visible = products.filter(product => product.name.toLowerCase().includes(search.trim().toLowerCase()))
  const unavailable = selectedIds.filter(id => !products.some(product => product.id === id))
  return (
    <section className="rounded-lg border border-gray-300 bg-white p-4" aria-labelledby="setup-products-label">
      <h2 id="setup-products-label" className="text-sm font-semibold text-gray-900">Products in this Setup</h2>
      <p className="mt-1 text-xs text-gray-500">Select the products used here. Draft products appear publicly once published.</p>
      {loading ? <p role="status" className="mt-3 text-sm">Loading products...</p> : error ? (
        <div className="mt-3 text-sm text-red-700" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry} disabled={disabled} className="mt-2 underline">Retry loading products</button>
        </div>
      ) : (
        <>
          <label htmlFor="setup-products-search" className="sr-only">Search products</label>
          <input id="setup-products-search" type="search" value={search} disabled={disabled}
            onChange={event => setSearch(event.target.value)} placeholder="Search products..."
            className="mt-3 w-full rounded-lg border px-3 py-2 text-sm text-gray-900" />
          <p className="my-2 text-xs text-gray-500" role="status">{selectedIds.length} selected</p>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {visible.map(product => (
              <label key={product.id} className="flex items-center gap-3 rounded p-2 text-sm text-gray-900 hover:bg-gray-50">
                <input type="checkbox" checked={selectedIds.includes(product.id)} disabled={disabled}
                  onChange={event => onChange(event.target.checked ? [...selectedIds, product.id] : selectedIds.filter(id => id !== product.id))}
                  className="h-4 w-4 shrink-0" />
                <span className="break-words min-w-0">{product.name}{!product.published && <span className="ml-2 text-xs text-gray-500">(Draft)</span>}</span>
              </label>
            ))}
            {!visible.length && <p className="py-2 text-sm text-gray-500">{products.length ? 'No matching products.' : 'No products available yet.'}</p>}
          </div>
          {unavailable.map(id => (
            <label key={id} className="mt-2 flex items-center gap-3 text-sm text-gray-500">
              <input type="checkbox" checked disabled={disabled} onChange={() => onChange(selectedIds.filter(value => value !== id))} />
              <span className="min-w-0 break-all">Unavailable product ({id}) — uncheck to remove</span>
            </label>
          ))}
        </>
      )}
    </section>
  )
}
