// // 'use client'
// // import { useState, useEffect } from 'react'
// // import { createClient } from '../../lib/supabase/client'
// // import { useRouter } from 'next/navigation'

// // export default function NewSetup() {
// //   const supabase = createClient()
// //   const router = useRouter()

// //   const [title, setTitle] = useState('')
// //   const [slug, setSlug] = useState('')
// //   const [ownerName, setOwnerName] = useState('')
// //   const [shortIntro, setShortIntro] = useState('')
// //   const [content, setContent] = useState('')
// //   const [categoryId, setCategoryId] = useState('')
// //   const [coverImage, setCoverImage] = useState<File | null>(null)
// //   const [galleryFiles, setGalleryFiles] = useState<File[]>([])
// //   const [loading, setLoading] = useState(false)
// //   const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

// //   useEffect(() => {
// //     supabase
// //       .from<{ id: string; name: string }>('categories')
// //       .select('id, name')
// //       .then(({ data }: { data: { id: string; name: string }[] | null }) => setCategories(data || []))
// //   }, [])

// //   const uploadImage = async (file: File, bucket: string = 'setups') => {
// //     const fileExt = file.name.split('.').pop()
// //     const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
// //     const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)
// //     if (error) throw error
// //     return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
// //   }

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setLoading(true)

// //     try {
// //       let coverImageUrl = null
// //       if (coverImage) coverImageUrl = await uploadImage(coverImage)

// //       const { data: setup, error } = await supabase
// //         .from('setups')
// //         .insert({
// //           title,
// //           slug,
// //           owner_name: ownerName,
// //           short_intro: shortIntro,
// //           content,
// //           category_id: categoryId || null,
// //           cover_image_url: coverImageUrl,
// //           published: false,
// //           // author_id automatically set by RLS policy? Actually policy check only uses auth.uid() for insert,
// //           // but we need to set author_id explicitly or use a server action. We'll fetch user in component.
// //         })
// //         .select('id')
// //         .single()

// //       if (error) throw error

// //       // Upload gallery images and insert into setup_images
// //       if (setup && galleryFiles.length > 0) {
// //         for (let i = 0; i < galleryFiles.length; i++) {
// //           const url = await uploadImage(galleryFiles[i])
// //           await supabase.from('setup_images').insert({
// //             setup_id: setup.id,
// //             image_url: url,
// //             sort_order: i,
// //           })
// //         }
// //       }

// //       router.push('/admin')
// //     } catch (err: any) {
// //       alert(err.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Fetch current user to set author_id on insert
// //   // We'll do this inside handleSubmit or use a server action.
// //   // Simpler: use supabase.auth.getUser() inside handleSubmit.

// //   // Modify handleSubmit to get user and add author_id:
// //   const handleSubmitWithAuth = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     const { data: { user } } = await supabase.auth.getUser()
// //     if (!user) { alert('Not authenticated'); setLoading(false); return }

// //     try {
// //       let coverImageUrl = null
// //       if (coverImage) coverImageUrl = await uploadImage(coverImage)

// //       const { data: setup, error } = await supabase
// //         .from('setups')
// //         .insert({
// //           title, slug, owner_name: ownerName, short_intro: shortIntro, content,
// //           category_id: categoryId || null,
// //           cover_image_url: coverImageUrl,
// //           published: false,
// //           author_id: user.id
// //         })
// //         .select('id')
// //         .single()

// //       if (error) throw error

// //       if (setup && galleryFiles.length > 0) {
// //         for (let i = 0; i < galleryFiles.length; i++) {
// //           const url = await uploadImage(galleryFiles[i])
// //           await supabase.from('setup_images').insert({ setup_id: setup.id, image_url: url, sort_order: i })
// //         }
// //       }

// //       router.push('/admin')
// //     } catch (err: any) {
// //       alert(err.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto p-6">
// //       <h1 className="text-2xl font-bold mb-4">New Setup</h1>
// //       <form onSubmit={handleSubmitWithAuth} className="space-y-4">
// //         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border p-2" required />
// //         <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug (auto or custom)" className="w-full border p-2" />
// //         <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Owner Name" className="w-full border p-2" required />
// //         <textarea value={shortIntro} onChange={e => setShortIntro(e.target.value)} placeholder="Short intro" className="w-full border p-2" />
// //         <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Full blog content (markdown/HTML)" rows={10} className="w-full border p-2" required />
// //         <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border p-2">
// //           <option value="">No Category</option>
// //           {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
// //         </select>
// //         <div>
// //           <label className="block mb-1">Cover Image</label>
// //           <input type="file" onChange={e => setCoverImage(e.target.files?.[0] || null)} accept="image/*" />
// //         </div>
// //         <div>
// //           <label className="block mb-1">Gallery Images (multiple)</label>
// //           <input type="file" multiple onChange={e => setGalleryFiles(Array.from(e.target.files || []))} accept="image/*" />
// //         </div>
// //         <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
// //           {loading ? 'Creating...' : 'Create Setup'}
// //         </button>
// //       </form>
// //     </div>
// //   )
// // }















// // app/admin/new/page.tsx
// 'use client'
// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'
// import TiptapEditor from '@/components/Editor'
// import { uploadImage } from '@/lib/utils/supabase-uploads'

// export default function NewSetup() {
//   const supabase = createClient()
//   const router = useRouter()

//   const [title, setTitle] = useState('')
//   const [slug, setSlug] = useState('')
//   const [ownerName, setOwnerName] = useState('')
//   const [shortIntro, setShortIntro] = useState('')
//   const [content, setContent] = useState('')
//   const [categoryId, setCategoryId] = useState('')
//   const [categories, setCategories] = useState<any[]>([])

//   const [coverFile, setCoverFile] = useState<File | null>(null)
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Fetch categories
//   useEffect(() => {
//     supabase
//       .from('categories')
//       .select('id, name')
//       .then(({ data }) => setCategories(data || []))
//   }, [])

//   // Auto-generate slug from title (optional)
//   useEffect(() => {
//     if (title && !slug) {
//       setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
//     }
//   }, [title, slug])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) throw new Error('Not authenticated')

//       // Upload cover image
//       let coverImageUrl: string | null = null
//       if (coverFile) {
//         coverImageUrl = await uploadImage(coverFile, 'setups', 'covers')
//         if (!coverImageUrl) throw new Error('Cover upload failed')
//       }

//       // Insert setup
//       const { data: setup, error: insertError } = await supabase
//         .from('setups')
//         .insert({
//           title,
//           slug,
//           owner_name: ownerName,
//           short_intro: shortIntro,
//           content,
//           category_id: categoryId || null,
//           cover_image_url: coverImageUrl,
//           published: false,
//           author_id: user.id,
//         })
//         .select('id')
//         .single()

//       if (insertError) throw insertError

//       // Upload gallery images and insert into setup_images
//       if (setup && galleryFiles.length > 0) {
//         for (let i = 0; i < galleryFiles.length; i++) {
//           const url = await uploadImage(galleryFiles[i], 'setups', 'gallery')
//           if (url) {
//             await supabase.from('setup_images').insert({
//               setup_id: setup.id,
//               image_url: url,
//               sort_order: i + 1,
//             })
//           }
//         }
//       }

//       router.push('/admin') // success
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-full mx-auto p-4 sm:p-6 bg-slate-200 text-gray-900 ">
//       <h1 className="text-2xl font-bold mb-6">New Desk Setup</h1>
//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <input
//           type="text"
//           placeholder="Title *"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//           className="w-full border p-3 rounded-lg text-base"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Slug (auto-generated if empty)"
//           value={slug}
//           onChange={e => setSlug(e.target.value)}
//           className="w-full border p-3 rounded-lg text-base"
//         />
//         <input
//           type="text"
//           placeholder="Owner Name *"
//           value={ownerName}
//           onChange={e => setOwnerName(e.target.value)}
//           className="w-full border p-3 rounded-lg text-base"
//           required
//         />
//         <textarea
//           placeholder="Short intro (shown in cards)"
//           value={shortIntro}
//           onChange={e => setShortIntro(e.target.value)}
//           rows={3}
//           className="w-full border p-3 rounded-lg text-base"
//         />
//         <select
//           value={categoryId}
//           onChange={e => setCategoryId(e.target.value)}
//           className="w-full border p-3 rounded-lg text-base bg-white"
//         >
//           <option value="">No Category</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>

//         {/* Cover Image */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Cover Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setCoverFile(e.target.files?.[0] || null)}
//             className="text-sm"
//           />
//         </div>

//         {/* Gallery Images */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Gallery Images (multiple)</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={e => setGalleryFiles(Array.from(e.target.files || []))}
//             className="text-sm"
//           />
//         </div>

//         {/* Tiptap Editor */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Content *</label>
//           <TiptapEditor content={content} onChange={setContent} />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
//         >
//           {loading ? 'Saving...' : 'Create Setup'}
//         </button>
//       </form>
//     </div>
//   )
// }














// app/admin/new/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { uploadImage } from '@/lib/utils/supabase-uploads'

import CategoryMultiSelect from '@/components/CategoryMultiSelect'


// Dynamically import editor to avoid SSR issues with browser APIs
const UltimateTipTapEditor = dynamic(() => import('@/components/UltimateTipTapEditor'), {
  ssr: false,
  loading: () => <p className="p-4 text-center">Loading editor...</p>,
})

export default function NewSetup() {
  const supabase = createClient()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [shortIntro, setShortIntro] = useState('')
  const [content, setContent] = useState('')
  // const [categoryId, setCategoryId] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])  // <-- change
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name')
      .then(({ data }) => setCategories(data || []))
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(newSlug)
    }
  }, [title, slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload cover image
      let coverImageUrl: string | null = null
      if (coverFile) {
        coverImageUrl = await uploadImage(coverFile, 'setups', 'covers')
      }

      // Insert setup
      const { data: setup, error: insertError } = await supabase
        .from('setups')
        .insert({
          title,
          slug,
          owner_name: ownerName,
          short_intro: shortIntro,
          content,
          // category_id: categoryId || null,
          cover_image_url: coverImageUrl,
          published: false,
          author_id: user.id,
        })
        .select('id')
        .single()

      if (insertError) throw insertError


       // Insert multiple categories
      if (setup && categoryIds.length > 0) {
        const rows = categoryIds.map(catId => ({
          setup_id: setup.id,
          category_id: catId,
        }))
        const { error: catError } = await supabase.from('setup_categories').insert(rows)
        if (catError) throw catError
      }


      // Upload gallery images
      if (setup && galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const url = await uploadImage(galleryFiles[i], 'setups', 'gallery')
          await supabase.from('setup_images').insert({
            setup_id: setup.id,
            image_url: url,
            sort_order: i + 1,
          })
        }
      }

      router.push('/admin') // success
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 text-gray-800 sm:p-6 bg-slate-200 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">New Desk Setup</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

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

        {/* <select
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
        </select> */}
<div>
        <label className="block text-sm font-medium mb-1">Categories</label>
        <CategoryMultiSelect
          categories={categories}
          selectedIds={categoryIds}
          onChange={setCategoryIds}
        />
      </div>


      
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gallery Images (multiple)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <UltimateTipTapEditor content={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Create Setup'}
        </button>
      </form>
    </div>
  )
}