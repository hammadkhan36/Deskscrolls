// // // app/admin/posts/PostFilters.tsx
// // 'use client'

// // import { useRouter, useSearchParams } from 'next/navigation'

// // export default function PostFilters({ currentStatus, currentAuthor }: { currentStatus: string; currentAuthor: string }) {
// //   const router = useRouter()
// //   const searchParams = useSearchParams()

// //   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const params = new URLSearchParams(searchParams.toString())
// //     params.set('status', e.target.value)
// //     router.push(`/admin/posts?${params.toString()}`)
// //   }

// //   const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const params = new URLSearchParams(searchParams.toString())
// //     if (e.target.value) {
// //       params.set('author', e.target.value)
// //     } else {
// //       params.delete('author')
// //     }
// //     router.push(`/admin/posts?${params.toString()}`)
// //   }

// //   return (
// //     <div className="flex gap-4 mb-6 flex-wrap">
// //       <div>
// //         <label className="block text-sm font-medium mb-1">Status</label>
// //         <select value={currentStatus} onChange={handleStatusChange} className="border rounded px-3 py-1">
// //           <option value="all">All Active</option>
// //           <option value="published">Published</option>
// //           <option value="draft">Drafts</option>
// //           <option value="deleted">Trash</option>
// //         </select>
// //       </div>
// //       <div>
// //         <label className="block text-sm font-medium mb-1">Author</label>
// //         <select value={currentAuthor} onChange={handleAuthorChange} className="border rounded px-3 py-1">
// //           <option value="">All Authors</option>
// //           {/* Authors list will be passed via parent */}
// //         </select>
// //       </div>
// //     </div>
// //   )
// // }






















// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'

// type Author = { id: string; full_name: string }

// export default function PostFilters({
//   currentStatus,
//   currentAuthor,
//   authors,
// }: {
//   currentStatus: string
//   currentAuthor: string
//   authors: Author[]
// }) {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const updateParams = (key: string, value: string) => {
//     const params = new URLSearchParams(searchParams.toString())
//     if (value) {
//       params.set(key, value)
//     } else {
//       params.delete(key)
//     }
//     router.push(`/admin/posts?${params.toString()}`)
//   }

//   return (
//     <div className="flex gap-4 mb-6 flex-wrap">
//       <div>
//         <label className="block text-sm font-medium mb-1">Status</label>
//         <select
//           value={currentStatus}
//           onChange={(e) => updateParams('status', e.target.value)}
//           className="border rounded px-3 py-1"
//         >
//           <option value="all">All Active</option>
//           <option value="published">Published</option>
//           <option value="draft">Drafts</option>
//           <option value="deleted">Trash</option>
//         </select>
//       </div>
//       <div>
//         <label className="block text-sm font-medium mb-1">Author</label>
//         <select
//           value={currentAuthor}
//           onChange={(e) => updateParams('author', e.target.value)}
//           className="border rounded px-3 py-1"
//         >
//           <option value="">All Authors</option>
//           {authors.map((a) => (
//             <option key={a.id} value={a.id}>
//               {a.full_name || a.id.slice(0, 8)}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   )
// }





















'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Author = { id: string; full_name: string }

export default function PostFilters({
  currentStatus,
  currentAuthor,
  authors,
}: {
  currentStatus: string
  currentAuthor: string
  authors: Author[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/posts?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-auto">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={currentStatus}
          onChange={(e) => updateParams('status', e.target.value)}
          className="w-full sm:w-48 border rounded px-3 py-1 bg-white"
        >
          <option value="all">All Active</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="deleted">Trash</option>
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label className="block text-sm font-medium mb-1">Author</label>
        <select
          value={currentAuthor}
          onChange={(e) => updateParams('author', e.target.value)}
          className="w-full sm:w-48 border rounded px-3 py-1 bg-white"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name || a.id.slice(0, 8)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}