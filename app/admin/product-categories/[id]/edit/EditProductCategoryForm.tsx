'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  updateProductCategory,
  deleteProductCategory,
} from './actions'

type Category = {
  id: string
  name: string
}

type CurrentCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  meta_title: string | null
  meta_description: string | null
  published: boolean
  sort_order: number
}

export default function EditProductCategoryForm({
  category,
  categories,
}: {
  category: CurrentCategory
  categories: Category[]
}) {
  const [loading, setLoading] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [error, setError] =
    useState('')

  async function handleUpdate(
    formData: FormData
  ) {
    setLoading(true)
    setError('')

    const result =
      await updateProductCategory(
        category.id,
        formData
      )

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This is only allowed if no products or child categories are using it.`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    const result =
      await deleteProductCategory(
        category.id
      )

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
    }
  }

  return (
    <form
      action={handleUpdate}
      className="space-y-6"
    >
      {/* Basic */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Basic Information
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Category Name *
            </label>

            <input
              name="name"
              required
              defaultValue={category.name}
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Slug *
            </label>

            <input
              name="slug"
              required
              defaultValue={category.slug}
              className="w-full border rounded-lg px-3 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Changing the slug changes the
              public category URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              defaultValue={
                category.description || ''
              }
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Organization
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Parent Category
            </label>

            <select
              name="parent_id"
              defaultValue={
                category.parent_id || ''
              }
              className="w-full border rounded-lg px-3 py-2.5 bg-white"
            >
              <option value="">
                No parent — Top Level
              </option>

              {categories.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 mt-1">
              A category cannot be its own
              parent.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Sort Order
            </label>

            <input
              type="number"
              name="sort_order"
              min="0"
              step="1"
              defaultValue={
                category.sort_order ?? 0
              }
              className="w-full border rounded-lg px-3 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          SEO
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Meta Title
            </label>

            <input
              name="meta_title"
              defaultValue={
                category.meta_title || ''
              }
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Meta Description
            </label>

            <textarea
              name="meta_description"
              rows={3}
              defaultValue={
                category.meta_description ||
                ''
              }
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Publishing
        </h2>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={
              category.published
            }
            className="mt-1"
          />

          <div>
            <p className="text-sm font-medium">
              Published
            </p>

            <p className="text-xs text-gray-500">
              Allow this category to appear
              publicly.
            </p>
          </div>
        </label>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={
              loading || deleting
            }
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : 'Save Changes'}
          </button>

          <Link
            href="/admin/product-categories"
            className="border px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={
            loading || deleting
          }
          className="text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
        >
          {deleting
            ? 'Deleting...'
            : 'Delete Category'}
        </button>
      </div>
    </form>
  )
            }
