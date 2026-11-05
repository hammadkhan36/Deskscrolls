'use client'

import { useState } from 'react'
import { createBlog, updateBlog } from './actions'
import RichEditor from './RichEditor'
import RelationshipSelector, {
  type RelationshipOption,
} from './RelationshipSelector'

type Category = { id: string; name: string }

type InitialData = {
  id?: string
  title?: string
  slug?: string
  category_id?: string | null
  cover_image_url?: string | null
  short_intro?: string | null
  content?: string
  meta_title?: string | null
  meta_description?: string | null
  published?: boolean
  product_ids?: string[]
  brand_ids?: string[]
  setup_ids?: string[]
}

export default function BlogForm({
  categories,
  products,
  brands,
  setups,
  initialData,
}: {
  categories: Category[]
  products: RelationshipOption[]
  brands: RelationshipOption[]
  setups: RelationshipOption[]
  initialData?: InitialData
}) {
  const isEdit = !!initialData?.id
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState(initialData?.content || '')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    formData.set('content', content)

    const res = isEdit
      ? await updateBlog(initialData!.id!, formData)
      : await createBlog(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            name="title"
            required
            defaultValue={initialData?.title || ''}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              defaultValue={initialData?.slug || ''}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category_id"
              defaultValue={initialData?.category_id || ''}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">-- Select --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            name="cover_image_url"
            defaultValue={initialData?.cover_image_url || ''}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Intro</label>
          <textarea
            name="short_intro"
            rows={2}
            defaultValue={initialData?.short_intro || ''}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
          <RichEditor value={content} onChange={setContent} />
          <input type="hidden" name="content" value={content} />
        </div>

        {/* Related Content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <RelationshipSelector
            title="Related Products"
            description="Select products mentioned or recommended in this article."
            name="product_ids"
            options={products}
            initialSelected={initialData?.product_ids || []}
          />

          <RelationshipSelector
            title="Related Brands"
            description="Select brands discussed in this article."
            name="brand_ids"
            options={brands}
            initialSelected={initialData?.brand_ids || []}
          />

          <RelationshipSelector
            title="Related Setups"
            description="Select desk setups connected with this article."
            name="setup_ids"
            options={setups}
            initialSelected={initialData?.setup_ids || []}
          />
        </div>

        <details className="border rounded-lg p-4" open={!!initialData?.meta_title}>
          <summary className="cursor-pointer font-medium text-sm">SEO (optional)</summary>
          <div className="mt-3 space-y-3">
            <input
              name="meta_title"
              placeholder="Meta title"
              defaultValue={initialData?.meta_title || ''}
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              name="meta_description"
              placeholder="Meta description"
              rows={2}
              defaultValue={initialData?.meta_description || ''}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </details>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialData?.published ?? false}
            className="rounded"
          />
          Publish karo
        </label>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Save Blog'}
      </button>
    </form>
  )
}
