'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createProductCategory } from './actions'

type Category = {
  id: string
  name: string
}

export default function ProductCategoryForm({
  categories,
}: {
  categories: Category[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    formData: FormData
  ) {
    setLoading(true)
    setError('')

    const result =
      await createProductCategory(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
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
              placeholder="Mechanical Keyboards"
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
              placeholder="mechanical-keyboards"
              className="w-full border rounded-lg px-3 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Public URL:
              /products/category/mechanical-keyboards
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              placeholder="Describe this product category..."
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
              defaultValue=""
              className="w-full border rounded-lg px-3 py-2.5 bg-white"
            >
              <option value="">
                No parent — Top Level
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Optional. Use this for future
              subcategories.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Sort Order
            </label>

            <input
              type="number"
              name="sort_order"
              defaultValue="0"
              min="0"
              step="1"
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
              placeholder="Mechanical Keyboards | DeskScroll"
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
              placeholder="Explore mechanical keyboards..."
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
            defaultChecked
            className="mt-1"
          />

          <div>
            <p className="text-sm font-medium">
              Published
            </p>

            <p className="text-xs text-gray-500">
              Allow this category to appear on
              public product pages.
            </p>
          </div>
        </label>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? 'Creating...'
            : 'Create Category'}
        </button>

        <Link
          href="/admin/product-categories"
          className="border px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
        }
