'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  createProduct,
  updateProduct,
  softDeleteProduct,
} from './actions'
import RichEditor from '@/admin/blogs/new/RichEditor'

type Brand = {
  id: string
  name: string
}

type Category = {
  id: string
  name: string
  parent_id: string | null
  sort_order: number
}

type InitialData = {
  id?: string
  name?: string
  slug?: string
  brand_id?: string | null
  short_description?: string | null
  content?: string | null
  cover_image_url?: string | null
  product_type?: string
  price_text?: string | null
  buy_url?: string | null
  cta_text?: string | null
  meta_title?: string | null
  meta_description?: string | null
  published?: boolean
  featured?: boolean
  sponsored?: boolean
  category_ids?: string[]
  primary_category_id?: string | null
}

export default function ProductForm({
  brands,
  categories,
  initialData,
}: {
  brands: Brand[]
  categories: Category[]
  initialData?: InitialData
}) {
  const isEdit = !!initialData?.id

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [content, setContent] = useState(
    initialData?.content || ''
  )

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(
      initialData?.category_ids || []
    )

  const [primaryCategory, setPrimaryCategory] =
    useState(
      initialData?.primary_category_id || ''
    )

  function toggleCategory(id: string) {
    setSelectedCategories((current) => {
      if (current.includes(id)) {
        const next = current.filter(
          (categoryId) => categoryId !== id
        )

        if (primaryCategory === id) {
          setPrimaryCategory(next[0] || '')
        }

        return next
      }

      const next = [...current, id]

      if (!primaryCategory) {
        setPrimaryCategory(id)
      }

      return next
    })
  }

  async function handleSubmit(
    formData: FormData
  ) {
    setLoading(true)
    setError('')

    formData.set('content', content)

    formData.delete('category_ids')

    selectedCategories.forEach((id) => {
      formData.append('category_ids', id)
    })

    formData.set(
      'primary_category_id',
      primaryCategory
    )

    const result =
      isEdit
        ? await updateProduct(
            initialData!.id!,
            formData
          )
        : await createProduct(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return

    const confirmed = window.confirm(
      'Is product ko delete karna hai?'
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    const result = await softDeleteProduct(
      initialData.id
    )

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
      return
    }

    window.location.href = '/admin/products'
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">
          Basic Information
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product Name *
            </label>

            <input
              name="name"
              required
              defaultValue={
                initialData?.name || ''
              }
              placeholder="e.g. Keychron Q1 Max"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Slug
            </label>

            <input
              name="slug"
              defaultValue={
                initialData?.slug || ''
              }
              placeholder="keychron-q1-max"
              className="w-full border rounded-lg px-3 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Leave empty to generate automatically.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Brand
            </label>

            <select
              name="brand_id"
              defaultValue={
                initialData?.brand_id || ''
              }
              className="w-full border rounded-lg px-3 py-2.5 bg-white"
            >
              <option value="">
                No brand
              </option>

              {brands.map((brand) => (
                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Short Description
            </label>

            <textarea
              name="short_description"
              rows={3}
              defaultValue={
                initialData?.short_description ||
                ''
              }
              placeholder="Short product summary used on cards and introductions."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Product Categories
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-5">
          Select all relevant categories and
          choose one primary category.
        </p>

        {categories.length === 0 ? (
          <p className="text-sm text-red-600">
            No product categories found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {categories.map((category) => {
              const selected =
                selectedCategories.includes(
                  category.id
                )

              return (
                <div
                  key={category.id}
                  className="border rounded-lg p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleCategory(
                            category.id
                          )
                        }
                      />

                      <span className="text-sm">
                        {category.name}
                      </span>
                    </label>

                    {selected && (
                      <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                        <input
                          type="radio"
                          name="primary_category_ui"
                          checked={
                            primaryCategory ===
                            category.id
                          }
                          onChange={() =>
                            setPrimaryCategory(
                              category.id
                            )
                          }
                        />

                        Primary
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Product Details */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">
          Product Details
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product Type *
            </label>

            <select
              name="product_type"
              defaultValue={
                initialData?.product_type ||
                'affiliate'
              }
              required
              className="w-full border rounded-lg px-3 py-2.5 bg-white"
            >
              <option value="affiliate">
                Affiliate
              </option>

              <option value="digital">
                Digital
              </option>

              <option value="standard">
                Standard
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price Text
            </label>

            <input
              name="price_text"
              defaultValue={
                initialData?.price_text || ''
              }
              placeholder="e.g. $199, From $99, Free"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Buy / Product URL
            </label>

            <input
              type="url"
              name="buy_url"
              defaultValue={
                initialData?.buy_url || ''
              }
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Button Text
            </label>

            <input
              name="cta_text"
              defaultValue={
                initialData?.cta_text ||
                'View Product'
              }
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">
          Media
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Cover Image URL
          </label>

          <input
            type="url"
            name="cover_image_url"
            defaultValue={
              initialData?.cover_image_url ||
              ''
            }
            placeholder="https://..."
            className="w-full border rounded-lg px-3 py-2.5"
          />
        </div>
      </section>

      {/* Rich Content */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Product Content
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-4">
          Add specifications, features,
          pros and cons, compatibility,
          buying notes, tables and FAQs.
        </p>

        <RichEditor
          value={content}
          onChange={setContent}
        />

        <input
          type="hidden"
          name="content"
          value={content}
        />
      </section>

      {/* SEO */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">
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
                initialData?.meta_title || ''
              }
              placeholder="SEO title"
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
                initialData?.meta_description ||
                ''
              }
              placeholder="SEO description"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">
          Publishing
        </h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={
                initialData?.published ??
                false
              }
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Publish Product
              </p>

              <p className="text-xs text-gray-500">
                Make this product publicly
                available.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={
                initialData?.featured ??
                false
              }
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Featured Product
              </p>

              <p className="text-xs text-gray-500">
                Allow this product to appear
                in featured sections.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="sponsored"
              defaultChecked={
                initialData?.sponsored ??
                false
              }
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Sponsored
              </p>

              <p className="text-xs text-gray-500">
                Mark this product as
                sponsored content.
              </p>
            </div>
          </label>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={loading || deleting}
          className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : isEdit
              ? 'Update Product'
              : 'Create Product'}
        </button>

        <Link
          href="/admin/products"
          className="border px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </Link>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className="border border-red-200 text-red-600 px-5 py-2.5 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 sm:ml-auto"
          >
            {deleting
              ? 'Deleting...'
              : 'Delete Product'}
          </button>
        )}
      </div>
    </form>
  )
      }
