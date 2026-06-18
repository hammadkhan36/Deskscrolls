// app/admin/categories/CategoriesTable.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { addCategory, updateCategory, deleteCategory } from './actions'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function CategoriesTable({ categories, isAdmin }: { categories: Category[]; isAdmin: boolean }) {
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    await addCategory(newName.trim(), newDesc.trim() || null)
    setNewName('')
    setNewDesc('')
    setAdding(false)
    router.refresh()
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    await updateCategory(id, editName.trim(), editDesc.trim() || null)
    setEditingId(null)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Add new category form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Add New Category</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Description</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="font-medium">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                  {cat.slug}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    cat.description || '—'
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id)
                          setEditName(cat.name)
                          setEditDesc(cat.description || '')
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}