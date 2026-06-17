// // import { createServerSupabase } from '../lib/supabase/server'
// // import Link from 'next/link'

// // type Setup = {
// //   id: string
// //   title: string
// //   slug: string
// //   published: boolean
// //   created_at: string
// // }

// // export default async function AdminDashboard() {
// //   const supabase = await createServerSupabase()
// //   const { data: setups } = await supabase
// //     .from('setups')
// //     .select('id, title, slug, published, created_at')
// //     .order('created_at', { ascending: false })

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">Your Setups</h1>
// //         <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded">+ New Setup</Link>
// //       </div>
// //       <ul className="space-y-2">
// //         {setups?.map((setup) => (
// //           <li key={setup.id} className="border p-3 rounded flex justify-between">
// //             <div>
// //               <Link href={`/admin/edit/${setup.id}`} className="font-semibold hover:underline">{setup.title}</Link>
// //               <span className="text-sm text-gray-500 ml-2">({setup.slug})</span>
// //             </div>
// //             <span className={`text-sm ${setup.published ? 'text-green-600' : 'text-yellow-600'}`}>
// //               {setup.published ? 'Published' : 'Draft'}
// //             </span>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   )
// // }





// import { createServerSupabase } from '@/lib/supabase/server'
// import Link from 'next/link'
// import AdminTable from './AdminTable'

// export default async function AdminDashboard() {
//   const supabase = await createServerSupabase()

//   const { data: setups, error } = await supabase
//     .from('setups')
//     .select(`
//       id,
//       title,
//       slug,
//       owner_name,
//       published,
//       created_at,
//       updated_at,
//       author:profiles(full_name),
//       categories:setup_categories (
//         category:categories(name)
//       )
//     `)
//     .order('created_at', { ascending: false })

//   if (error) {
//     console.error('Admin fetch error:', error)
//     return <div className="p-10 text-red-600">Failed to load setups.</div>
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">All Setups</h1>
//         <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//           + New Setup
//         </Link>
//       </div>

//       {setups && setups.length > 0 ? (
//         <AdminTable setups={setups} />
//       ) : (
//         <div className="text-gray-500 text-center py-12">No setups yet.</div>
//       )}
//     </div>
//   )
// }













import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminTable from './AdminTable'

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()

  const { data: setups, error } = await supabase
    .from('setups')
    .select(`
      id,
      title,
      slug,
      owner_name,
      published,
      created_at,
      updated_at,
      author:profiles(full_name),
      categories:setup_categories (
        category:categories(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin fetch error:', error)
    return <div className="p-10 text-red-600">Failed to load setups.</div>
  }

  // ---------- Data transformation (fix) ----------
  const safeSetups = (setups ?? []).map((setup: any) => ({
    ...setup,
    // author ko array se single object mein convert karo
    author: Array.isArray(setup.author) ? setup.author[0] ?? null : setup.author,
    // categories ko simple string array banao
    categories: Array.isArray(setup.categories)
      ? setup.categories
          .map((sc: any) => sc.category?.name)
          .filter(Boolean)
      : [],
  }))
  // -----------------------------------------------

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Setups</h1>
        <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Setup
        </Link>
      </div>

      {safeSetups.length > 0 ? (
        <AdminTable setups={safeSetups} />
      ) : (
        <div className="text-gray-500 text-center py-12">No setups yet.</div>
      )}
    </div>
  )
}