'use client'

import { useState } from 'react'
import {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from './actions'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError('')
    const res = await createBlogCategory(formData)
    if (res?.error) setError(res.error)
    else window.location.reload()
    setLoading(false)
  }

  async function handleUpdate(id: string, formData: FormData) {
    setLoading(true)
    setError('')
    const res = await updateBlogCategory(id, formData)
    if (res?.error) setError(res.error)
    else {
      setEditing(null)
      window.location.reload()
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yeh category delete karni hai?')) return
    const res = await deleteBlogCategory(id)
    if (res?.error) alert(res.error)
    else window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="font-semibold mb-4">New Category</h2>
        <form action={handleCreate} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Name (e.g. Guides)"
              className="min-h-11 rounded-lg border px-3 py-2.5 text-base"
            />

            <input
              name="slug"
              placeholder="Slug (optional)"
              className="min-h-11 rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <textarea
            name="description"
            placeholder="Short description (optional)"
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-base"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-50 sm:w-fit"
          >
            {loading ? 'Saving...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {categories.length === 0 && (
          <p className="p-6 text-gray-500">Koi category nahi hai.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="p-4">
            {editing === cat.id ? (
              <form
                action={(fd) => handleUpdate(cat.id, fd)}
                className="grid gap-3"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    name="name"
                    required
                    defaultValue={cat.name}
                    className="min-h-11 rounded-lg border px-3 py-2.5 text-base"
                  />

                  <input
                    name="slug"
                    defaultValue={cat.slug}
                    className="min-h-11 rounded-lg border px-3 py-2.5 text-base"
                  />
                </div>

                <textarea
                  name="description"
                  defaultValue={cat.description || ''}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2.5 text-base"
                />

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    type="submit"
                    disabled={loading}
                    className="min-h-11 rounded-lg bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    disabled={loading}
                    className="min-h-11 rounded-lg border px-4 text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{cat.name}</p>

                  <p className="mt-1 break-words text-xs leading-5 text-gray-500">
                    /{cat.slug}
                    {cat.description && ` • ${cat.description}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 sm:flex sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setEditing(cat.id)}
                    disabled={loading}
                    className="min-h-10 rounded-lg bg-blue-50 px-4 text-sm font-medium text-blue-700 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    disabled={loading}
                    className="min-h-10 rounded-lg bg-red-50 px-4 text-sm font-medium text-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
