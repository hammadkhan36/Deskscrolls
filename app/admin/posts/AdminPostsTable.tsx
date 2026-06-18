// // app/admin/posts/AdminPostsTable.tsx
// 'use client'

// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { togglePublish, softDeleteSetup, restoreSetup } from './actions'

// type Setup = {
//   id: string
//   title: string
//   slug: string
//   owner_name: string
//   published: boolean
//   deleted_at: string | null
//   author: { full_name: string; id: string } | null
//   categories: { category: { name: string } }[] | null
//   created_at: string
//   updated_at: string
// }

// export default function AdminPostsTable({ setups, status }: { setups: Setup[]; status: string }) {
//   const router = useRouter()

//   const handleToggle = async (id: string, currentPublished: boolean) => {
//     await togglePublish(id, currentPublished)
//     router.refresh()
//   }

//   const handleSoftDelete = async (id: string) => {
//     if (!confirm('Move to trash?')) return
//     await softDeleteSetup(id)
//     router.refresh()
//   }

//   const handleRestore = async (id: string) => {
//     await restoreSetup(id)
//     router.refresh()
//   }

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Categories</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
//             <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {setups.map((setup) => (
//             <tr key={setup.id} className="hover:bg-gray-50">
//               <td className="px-4 py-3">
//                 <div className="font-medium text-gray-900">{setup.title}</div>
//                 <div className="text-xs text-gray-500">/{setup.slug}</div>
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-700">
//                 {setup.author?.full_name || setup.owner_name}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-500">
//                 {setup.categories?.map(c => c.category.name).join(', ') || '—'}
//               </td>
//               <td className="px-4 py-3">
//                 {setup.deleted_at ? (
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                     Trash
//                   </span>
//                 ) : (
//                   <button
//                     onClick={() => handleToggle(setup.id, setup.published)}
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
//                       setup.published
//                         ? 'bg-green-100 text-green-800 hover:bg-green-200'
//                         : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
//                     }`}
//                   >
//                     {setup.published ? 'Published' : 'Draft'}
//                   </button>
//                 )}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-500">
//                 {new Date(setup.created_at).toLocaleDateString()}
//               </td>
//               <td className="px-4 py-3 text-right space-x-2">
//                 {setup.deleted_at ? (
//                   <>
//                     <button
//                       onClick={() => handleRestore(setup.id)}
//                       className="text-green-600 hover:text-green-800 text-sm"
//                     >
//                       Restore
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <a
//                       href={`/setups/${setup.slug}`}
//                       target="_blank"
//                       className="text-blue-600 hover:text-blue-800 text-sm"
//                     >
//                       View
//                     </a>
//                     <Link
//                       href={`/admin/edit/${setup.id}`}
//                       className="text-indigo-600 hover:text-indigo-800 text-sm"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleSoftDelete(setup.id)}
//                       className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                       Trash
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }



















'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { togglePublish, softDeleteSetup, restoreSetup } from './actions'

type Setup = {
  id: string
  title: string
  slug: string
  owner_name: string
  published: boolean
  deleted_at: string | null
  author: { full_name: string; id: string } | null
  categories: { category: { name: string } }[] | null
  created_at: string
  updated_at: string
}

export default function AdminPostsTable({ setups, status }: { setups: Setup[]; status: string }) {
  const router = useRouter()

  const handleToggle = async (id: string, currentPublished: boolean) => {
    await togglePublish(id, currentPublished)
    router.refresh()
  }

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Move to trash?')) return
    await softDeleteSetup(id)
    router.refresh()
  }

  const handleRestore = async (id: string) => {
    await restoreSetup(id)
    router.refresh()
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Author</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Categories</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {setups.map((setup) => (
            <tr key={setup.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{setup.title}</div>
                <div className="text-xs text-gray-500">/{setup.slug}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">
                {setup.author?.full_name || setup.owner_name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                {setup.categories?.map(c => c.category.name).join(', ') || '—'}
              </td>
              <td className="px-4 py-3">
                {setup.deleted_at ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Trash
                  </span>
                ) : (
                  <button
                    onClick={() => handleToggle(setup.id, setup.published)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                      setup.published
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {setup.published ? 'Published' : 'Draft'}
                  </button>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                {new Date(setup.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                {setup.deleted_at ? (
                  <button
                    onClick={() => handleRestore(setup.id)}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Restore
                  </button>
                ) : (
                  <>
                    <a
                      href={`/setups/${setup.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                    <Link href={`/admin/edit/${setup.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleSoftDelete(setup.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Trash
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}