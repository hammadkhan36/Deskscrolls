// app/admin/categories/CategoriesTable.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Add New Category
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Category Name *
            </label>

            <input
              type="text"
              placeholder="e.g. Minimal Setup"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>

            <input
              type="text"
              placeholder="Optional short description"
              value={newDesc}
              onChange={(event) => setNewDesc(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || !newName.trim()}
          className="mt-4 min-h-11 w-full rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
        >
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {/* Mobile category cards */}
      <div className="space-y-3 sm:hidden">
        {categories.map((cat) => (
          <article
            key={cat.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {editingId === cat.id ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={editDesc}
                    onChange={(event) => setEditDesc(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(cat.id)}
                    disabled={!editName.trim()}
                    className="min-h-11 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {cat.name}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    /{cat.slug}
                  </p>

                  {cat.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div
                  className={`mt-4 grid gap-2 border-t border-slate-100 pt-3 ${
                    isAdmin ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(cat.id)
                      setEditName(cat.name)
                      setEditDesc(cat.description || '')
                    }}
                    className="min-h-11 rounded-lg bg-indigo-50 px-4 text-sm font-semibold text-indigo-700"
                  >
                    Edit
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="min-h-11 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </article>
        ))}

        {categories.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No categories yet.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
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
                      className="min-h-10 w-full rounded-lg border px-3 py-2 text-sm"
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
                      className="min-h-10 w-full rounded-lg border px-3 py-2 text-sm"
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
                        className="min-h-10 rounded-lg px-3 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="min-h-10 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
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
                        className="min-h-10 rounded-lg px-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="min-h-10 rounded-lg px-3 text-sm font-medium text-red-700 hover:bg-red-50"
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
