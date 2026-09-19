// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { createBrand } from './actions'

// export default function BrandForm() {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   async function handleSubmit(formData: FormData) {
//     setLoading(true)
//     setError('')

//     const result = await createBrand(formData)

//     if (result?.error) {
//       setError(result.error)
//       setLoading(false)
//     }
//   }

//   return (
//     <form action={handleSubmit} className="space-y-6">

//       {/* Basic information */}
//       <section className="bg-white border rounded-xl p-6 shadow-sm">
//         <h2 className="font-semibold text-lg mb-5">
//           Basic Information
//         </h2>

//         <div className="grid gap-5">
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Brand Name *
//             </label>

//             <input
//               name="name"
//               required
//               placeholder="e.g. Logitech"
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Slug
//             </label>

//             <input
//               name="slug"
//               placeholder="logitech"
//               className="w-full border rounded-lg px-3 py-2.5"
//             />

//             <p className="text-xs text-gray-500 mt-1">
//               Leave empty to generate automatically.
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Short Description
//             </label>

//             <textarea
//               name="short_description"
//               rows={3}
//               placeholder="Short introduction to the brand."
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Full Description
//             </label>

//             <textarea
//               name="description"
//               rows={8}
//               placeholder="Detailed information about the brand..."
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Images and website */}
//       <section className="bg-white border rounded-xl p-6 shadow-sm">
//         <h2 className="font-semibold text-lg mb-5">
//           Media & Website
//         </h2>

//         <div className="grid gap-5">
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Logo URL
//             </label>

//             <input
//               type="url"
//               name="logo_url"
//               placeholder="https://..."
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Cover Image URL
//             </label>

//             <input
//               type="url"
//               name="cover_image_url"
//               placeholder="https://..."
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Official Website
//             </label>

//             <input
//               type="url"
//               name="website_url"
//               placeholder="https://www.logitech.com"
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>
//         </div>
//       </section>

//       {/* SEO */}
//       <section className="bg-white border rounded-xl p-6 shadow-sm">
//         <h2 className="font-semibold text-lg mb-5">
//           SEO
//         </h2>

//         <div className="grid gap-5">
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Meta Title
//             </label>

//             <input
//               name="meta_title"
//               placeholder="Logitech Products & Desk Setup Gear"
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Meta Description
//             </label>

//             <textarea
//               name="meta_description"
//               rows={3}
//               placeholder="SEO description..."
//               className="w-full border rounded-lg px-3 py-2.5"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Publishing */}
//       <section className="bg-white border rounded-xl p-6 shadow-sm">
//         <h2 className="font-semibold text-lg mb-5">
//           Publishing
//         </h2>

//         <div className="space-y-4">
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="published"
//               className="mt-1"
//             />

//             <div>
//               <p className="text-sm font-medium">
//                 Publish Brand
//               </p>

//               <p className="text-xs text-gray-500">
//                 Make this brand publicly available.
//               </p>
//             </div>
//           </label>

//           <label className="flex items-start gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="featured"
//               className="mt-1"
//             />

//             <div>
//               <p className="text-sm font-medium">
//                 Featured Brand
//               </p>

//               <p className="text-xs text-gray-500">
//                 Allow this brand to appear in featured sections.
//               </p>
//             </div>
//           </label>
//         </div>
//       </section>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
//           {error}
//         </div>
//       )}

//       <div className="flex items-center gap-3 pb-8">
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
//         >
//           {loading ? 'Saving...' : 'Create Brand'}
//         </button>

//         <Link
//           href="/admin/brands"
//           className="border px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50"
//         >
//           Cancel
//         </Link>
//       </div>

//     </form>
//   )
//           }





'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrand } from './actions'

export default function BrandForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = await createBrand(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">

      {/* Basic information */}
      <section className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
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
              placeholder="e.g. Logitech"
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Slug
            </label>

            <input
              name="slug"
              placeholder="logitech"
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />

            <p className="text-xs text-gray-500 mt-1">
              Leave empty to generate automatically.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Short Description
            </label>

            <textarea
              name="short_description"
              rows={3}
              placeholder="Short introduction to the brand."
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Description
            </label>

            <textarea
              name="description"
              rows={8}
              placeholder="Detailed information about the brand..."
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>
        </div>
      </section>

      {/* Images and website */}
      <section className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
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
              placeholder="https://..."
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Cover Image URL
            </label>

            <input
              type="url"
              name="cover_image_url"
              placeholder="https://..."
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Official Website
            </label>

            <input
              type="url"
              name="website_url"
              placeholder="https://www.logitech.com"
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
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
              placeholder="Logitech Products & Desk Setup Gear"
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Meta Description
            </label>

            <textarea
              name="meta_description"
              rows={3}
              placeholder="SEO description..."
              className="min-h-11 w-full rounded-lg border px-3 py-2.5 text-base"
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Publishing
        </h2>

        <div className="space-y-4">
          <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <input
              type="checkbox"
              name="published"
              className="mt-1"
            />

            <div>
              <p className="text-sm font-medium">
                Publish Brand
              </p>

              <p className="text-xs text-gray-500">
                Make this brand publicly available.
              </p>
            </div>
          </label>

          <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <input
              type="checkbox"
              name="featured"
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

      <div className="sticky bottom-0 z-20 -mx-3 flex gap-2 border-t border-slate-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pb-8 sm:shadow-none">
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 flex-1 rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-50 sm:flex-none"
        >
          {loading ? 'Saving...' : 'Create Brand'}
        </button>

        <Link
          href="/admin/brands"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border px-5 py-2.5 text-sm hover:bg-gray-50 sm:flex-none"
        >
          Cancel
        </Link>
      </div>

    </form>
  )
}
