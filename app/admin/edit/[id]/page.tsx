// app/admin/edit/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { uploadImage } from '@/lib/utils/supabase-uploads'

// Dynamically import editor (same as new page)
const UltimateTipTapEditor = dynamic(() => import('@/components/UltimateTipTapEditor'), {
  ssr: false,
  loading: () => <p className="p-4 text-center">Loading editor...</p>,
})

export default function EditSetup() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const setupId = params.id as string

  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [shortIntro, setShortIntro] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [published, setPublished] = useState(false)

  // Images state
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [existingGalleryImages, setExistingGalleryImages] = useState<{ id: string; url: string }[]>([])

  // Loading & error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(true) // while we load setup

  const [saved, setSaved] = useState(false)



  // Fetch categories
  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name')
      .then(({ data }) => setCategories(data || []))
  }, [])

  // Fetch existing setup
  useEffect(() => {
    const fetchSetup = async () => {
      setFetching(true)
      const { data: setup, error } = await supabase
        .from('setups')
        .select('*, setup_images(id, image_url)')
        .eq('id', setupId)
        .single()

      if (error || !setup) {
        setError('Setup not found or you do not have permission to edit it.')
        setFetching(false)
        return
      }

      // Populate form
      setTitle(setup.title)
      setSlug(setup.slug)
      setOwnerName(setup.owner_name)
      setShortIntro(setup.short_intro || '')
      setContent(setup.content || '')
      setCategoryId(setup.category_id || '')
      setPublished(setup.published)
      setExistingCoverUrl(setup.cover_image_url)
      setExistingGalleryImages(
        (setup.setup_images || []).map((img: any) => ({ id: img.id, url: img.image_url }))
      )

      setFetching(false)
    }
    if (setupId) fetchSetup()
  }, [setupId])

  // Auto-generate slug from title (if slug is empty)
  useEffect(() => {
    if (title && !slug) {
      const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setSlug(newSlug)
    }
  }, [title, slug])

  // Delete existing gallery image handler
  const deleteGalleryImage = async (imageId: string) => {
    const { error } = await supabase.from('setup_images').delete().eq('id', imageId)
    if (error) {
      alert('Failed to delete image')
      return
    }
    setExistingGalleryImages(prev => prev.filter(img => img.id !== imageId))
  }

  // Submit handler (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Handle cover image: if new file chosen, upload and replace; otherwise keep old
      let coverImageUrl = existingCoverUrl
      if (coverFile) {
        coverImageUrl = await uploadImage(coverFile, 'setups', 'covers')
      }

      // Update setup row
      const { error: updateError } = await supabase
        .from('setups')
        .update({
          title,
          slug,
          owner_name: ownerName,
          short_intro: shortIntro,
          content,
          category_id: categoryId || null,
          cover_image_url: coverImageUrl,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', setupId)

      if (updateError) throw updateError

      // Upload new gallery images (if any)
      if (galleryFiles.length > 0) {
        // Get current max sort_order or start from 0
        const maxOrder = existingGalleryImages.length > 0
          ? Math.max(...existingGalleryImages.map((_, i) => i + 1))
          : 0

        for (let i = 0; i < galleryFiles.length; i++) {
          const url = await uploadImage(galleryFiles[i], 'setups', 'gallery')
          if (url) {
            await supabase.from('setup_images').insert({
              setup_id: setupId,
              image_url: url,
              sort_order: maxOrder + i + 1,
            })
          }
        }
      }

      router.push('/admin') // back to dashboard

      // success
setSaved(true)
setError('')
setLoading(false)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="max-w-lg mx-auto p-4 sm:p-6 text-center">Loading setup...</div>
  }

  if (error && !title) {
    return <div className="max-w-lg mx-auto p-4 sm:p-6 text-red-600">{error}</div>
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Desk Setup</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
{saved && (
  <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
    Setup updated successfully! You can continue editing.
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-lg text-base"
          required
        />
        <input
          type="text"
          placeholder="Slug (auto-generated if empty)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border p-3 rounded-lg text-base"
        />
        <input
          type="text"
          placeholder="Owner Name *"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="w-full border p-3 rounded-lg text-base"
          required
        />
        <textarea
          placeholder="Short intro (shown in cards)"
          value={shortIntro}
          onChange={(e) => setShortIntro(e.target.value)}
          rows={3}
          className="w-full border p-3 rounded-lg text-base"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border p-3 rounded-lg text-base bg-white"
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Published toggle */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5"
          />
          <span>Published</span>
        </label>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          {existingCoverUrl && !coverFile && (
            <div className="mb-2">
              <img src={existingCoverUrl} alt="Cover" className="h-32 object-cover rounded border" />
              <p className="text-xs text-gray-500">Current cover (upload new to replace)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Gallery Images</label>
          {existingGalleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {existingGalleryImages.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.url} alt="Gallery" className="h-20 w-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => deleteGalleryImage(img.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
            className="text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Add new images to gallery</p>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <UltimateTipTapEditor content={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Setup'}
        </button>
      </form>
    </div>
  )
}