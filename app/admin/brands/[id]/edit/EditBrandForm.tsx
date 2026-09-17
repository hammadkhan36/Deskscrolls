
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  updateBrand,
  deleteBrand,
} from '@/app/admin/brands/[id]/edit/actions'

type Brand = {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  website_url: string | null
  meta_title: string | null
  meta_description: string | null
  published: boolean
  featured: boolean
}

export default function EditBrandForm({
  brand,
}: {
  brand: Brand
}) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleUpdate(formData: FormData) {
    setLoading(true)
    setError('')

    const result = await updateBrand(
      brand.id,
      formData
    )

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${brand.name}"? The brand will be removed from DeskScroll.`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    const result = await deleteBrand(brand.id)

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
    }
  }

  return (
    <form action={handleUpdate} className="space-y-6">

      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Basic Information
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Brand Name *
            </label>

            <input
              name="name"
              required
              defaultValue={brand.name}
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
              defaultValue={brand.slug}
              className="w-full border rounded-lg px-3 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Changing the slug will change the public brand URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Short Description
            </label>

            <textarea
              name="short_description"
              rows={3}
              defaultValue={brand.short_description || ''}
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Description
            </label>

            <textarea
              name="description"
              rows={8}
              defaultValue={brand.description || ''}
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Media & Website
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Logo URL
            </label>

            <input
              type="url"
              name="logo_url"
              defaultValue={brand.logo_url || ''}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Cover Image URL
            </label>

            <input
              type="url"
              name="cover_image_url"
              defaultValue={brand.cover_image_url || ''}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Official Website
            </label>

            <input
              type="url"
              name="website_url"
              defaultValue={brand.website_url || ''}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

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
              defaultValue={brand.meta_title || ''}
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
              defaultValue={brand.meta_description || ''}
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Publishing
        </h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={brand.published}
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Published
              </p>

              <p className="text-xs text-gray-500">
                Make this brand publicly available.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={brand.featured}
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Featured Brand
              </p>

              <p className="text-xs text-gray-500">
                Allow this brand to appear in featured sections.
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

      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || deleting}
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <Link
            href="/admin/brands"
            className="border px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || deleting}
          className="text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Brand'}
        </button>
      </div>
    </form>
  )
}
