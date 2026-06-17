// 'use client'

// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { togglePublish, deleteSetup } from './actions'

// type Setup = {
//   id: string
//   title: string
//   slug: string
//   owner_name: string
//   published: boolean
// //   category: { name: string } | null
//   author: { full_name: string } | null
//     categories: { category: { name: string } }[] | null   // <-- change
//   created_at: string
//   updated_at: string
// }

// export default function AdminTable({ setups }: { setups: Setup[] }) {
//   const router = useRouter()

//   const handleToggle = async (id: string, currentPublished: boolean) => {
//     if (!confirm(`Are you sure you want to ${currentPublished ? 'unpublish' : 'publish'} this setup?`)) return
//     try {
//       await togglePublish(id, currentPublished)
//       router.refresh() // update UI
//     } catch (error: any) {
//       alert(error.message)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this setup permanently?')) return
//     try {
//       await deleteSetup(id)
//       router.refresh()
//     } catch (error: any) {
//       alert(error.message)
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
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
//               {/* <td className="px-4 py-3 text-sm text-gray-500">
//                 {setup.category?.name || '—'}
//               </td> */}
//               <td className="px-4 py-3 text-sm text-gray-500">
//   {setup.categories && setup.categories.length > 0
//     ? setup.categories.map(c => c.category.name).join(', ')
//     : '—'
//   }
// </td>
//               <td className="px-4 py-3">
//                 <button
//                   onClick={() => handleToggle(setup.id, setup.published)}
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
//                     setup.published
//                       ? 'bg-green-100 text-green-800 hover:bg-green-200'
//                       : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
//                   }`}
//                 >
//                   {setup.published ? 'Published' : 'Draft'}
//                 </button>
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-500">
//                 {new Date(setup.created_at).toLocaleDateString()}
//               </td>
//               <td className="px-4 py-3 text-right space-x-2">
//                 {/* Preview link */}
//                 <a
//                   href={`/setups/${setup.slug}`}
//                   target="_blank"
//                   className="text-blue-600 hover:text-blue-800 text-sm"
//                 >
//                   Preview
//                 </a>
//                 {/* Edit link */}
//                 <Link href={`/admin/edit/${setup.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
//                   Edit
//                 </Link>
//                 {/* Delete button */}
//                 <button
//                   onClick={() => handleDelete(setup.id)}
//                   className="text-red-600 hover:text-red-800 text-sm"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }\\\\\\\















'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { togglePublish, deleteSetup } from './actions'

type Setup = {
  id: string
  title: string
  slug: string
  owner_name: string
  published: boolean
  author: { full_name: string } | null
  categories: { category: { name: string } }[] | null
  created_at: string
  updated_at: string
}

export default function AdminTable({ setups }: { setups: Setup[] }) {
  const router = useRouter()

  const handleToggle = async (id: string, currentPublished: boolean) => {
    if (!confirm(`Are you sure you want to ${currentPublished ? 'unpublish' : 'publish'} this setup?`)) return
    try {
      await togglePublish(id, currentPublished)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this setup permanently?')) return
    try {
      await deleteSetup(id)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
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
              <td className="px-4 py-3 text-sm text-gray-700">
                {setup.author?.full_name || setup.owner_name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {setup.categories && setup.categories.length > 0
                  ? setup.categories
                      .map(c => c.category?.name)
                      .filter(Boolean)
                      .join(', ')
                  : '—'
                }
              </td>
              <td className="px-4 py-3">
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
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(setup.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <a
                  href={`/setups/${setup.slug}`}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Preview
                </a>
                <Link href={`/admin/edit/${setup.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(setup.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}