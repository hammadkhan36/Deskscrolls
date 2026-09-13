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
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-4">New Category</h2>
        <form action={handleCreate} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              required
              placeholder="Name (e.g. Guides)"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="slug"
              placeholder="Slug (optional)"
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <textarea
            name="description"
            placeholder="Short description (optional)"
            rows={2}
            className="border rounded-lg px-3 py-2"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg w-fit hover:bg-gray-800 disabled:opacity-50"
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
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="name"
                    defaultValue={cat.name}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    name="slug"
                    defaultValue={cat.slug}
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
                <textarea
                  name="description"
                  defaultValue={cat.description || ''}
                  rows={2}
                  className="border rounded-lg px-3 py-2"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-black text-white px-3 py-1.5 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-3 py-1.5 rounded text-sm border"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-gray-500">
                    /{cat.slug}
                    {cat.description && ` • ${cat.description}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(cat.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-sm text-red-600 hover:underline"
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