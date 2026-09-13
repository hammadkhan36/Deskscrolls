// // // // import { createServerSupabase } from '../lib/supabase/server'
// // // // import Link from 'next/link'

// // // // type Setup = {
// // // //   id: string
// // // //   title: string
// // // //   slug: string
// // // //   published: boolean
// // // //   created_at: string
// // // // }

// // // // export default async function AdminDashboard() {
// // // //   const supabase = await createServerSupabase()
// // // //   const { data: setups } = await supabase
// // // //     .from('setups')
// // // //     .select('id, title, slug, published, created_at')
// // // //     .order('created_at', { ascending: false })

// // // //   return (
// // // //     <div className="max-w-4xl mx-auto p-6">
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <h1 className="text-2xl font-bold">Your Setups</h1>
// // // //         <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded">+ New Setup</Link>
// // // //       </div>
// // // //       <ul className="space-y-2">
// // // //         {setups?.map((setup) => (
// // // //           <li key={setup.id} className="border p-3 rounded flex justify-between">
// // // //             <div>
// // // //               <Link href={`/admin/edit/${setup.id}`} className="font-semibold hover:underline">{setup.title}</Link>
// // // //               <span className="text-sm text-gray-500 ml-2">({setup.slug})</span>
// // // //             </div>
// // // //             <span className={`text-sm ${setup.published ? 'text-green-600' : 'text-yellow-600'}`}>
// // // //               {setup.published ? 'Published' : 'Draft'}
// // // //             </span>
// // // //           </li>
// // // //         ))}
// // // //       </ul>
// // // //     </div>
// // // //   )
// // // // }





// // // import { createServerSupabase } from '@/lib/supabase/server'
// // // import Link from 'next/link'
// // // import AdminTable from './AdminTable'

// // // export default async function AdminDashboard() {
// // //   const supabase = await createServerSupabase()

// // //   const { data: setups, error } = await supabase
// // //     .from('setups')
// // //     .select(`
// // //       id,
// // //       title,
// // //       slug,
// // //       owner_name,
// // //       published,
// // //       created_at,
// // //       updated_at,
// // //       author:profiles(full_name),
// // //       categories:setup_categories (
// // //         category:categories(name)
// // //       )
// // //     `)
// // //     .order('created_at', { ascending: false })

// // //   if (error) {
// // //     console.error('Admin fetch error:', error)
// // //     return <div className="p-10 text-red-600">Failed to load setups.</div>
// // //   }

// // //   return (
// // //     <div className="max-w-6xl mx-auto p-6">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h1 className="text-2xl font-bold">All Setups</h1>
// // //         <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
// // //           + New Setup
// // //         </Link>
// // //       </div>

// // //       {setups && setups.length > 0 ? (
// // //         <AdminTable setups={setups} />
// // //       ) : (
// // //         <div className="text-gray-500 text-center py-12">No setups yet.</div>
// // //       )}
// // //     </div>
// // //   )
// // // }












// // import { createServerSupabase } from '@/lib/supabase/server'
// // import Link from 'next/link'
// // import AdminTable from './AdminTable'

// // export default async function AdminDashboard() {
// //   const supabase = await createServerSupabase()

// //   const { data: setups, error } = await supabase
// //     .from('setups')
// //     .select(`
// //       id,
// //       title,
// //       slug,
// //       owner_name,
// //       published,
// //       created_at,
// //       updated_at,
// //       author:profiles(full_name),
// //       categories:setup_categories (
// //         category:categories(name)
// //       )
// //     `)
// //     .order('created_at', { ascending: false })

// //   if (error) {
// //     console.error('Admin fetch error:', error)
// //     return <div className="p-10 text-red-600">Failed to load setups.</div>
// //   }

// //   const safeSetups = (setups ?? []).map((setup: any) => ({
// //     ...setup,
// //     author: Array.isArray(setup.author) ? setup.author[0] ?? null : setup.author,
// //     categories: Array.isArray(setup.categories)
// //       ? setup.categories
// //           .filter((sc: any) => sc?.category?.name)
// //           .map((sc: any) => ({ category: { name: sc.category.name } }))
// //       : [],
// //   }))

// //   return (
// //     <div className="max-w-6xl mx-auto p-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">All Setups</h1>
// //         <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
// //           + New Setup
// //         </Link>
// //       </div>

// //       {safeSetups.length > 0 ? (
// //         <AdminTable setups={safeSetups} />
// //       ) : (
// //         <div className="text-gray-500 text-center py-12">No setups yet.</div>
// //       )}
// //     </div>
// //   )
// // }












// // app/admin/page.tsx
// import { createServerSupabase } from '@/lib/supabase/server'

// export default async function AdminDashboard() {
//   const supabase = await createServerSupabase()

//   const { count: total } = await supabase
//     .from('setups')
//     .select('*', { count: 'exact', head: true })
//     .is('deleted_at', null)

//   const { count: published } = await supabase
//     .from('setups')
//     .select('*', { count: 'exact', head: true })
//     .eq('published', true)
//     .is('deleted_at', null)

//   const { count: drafts } = await supabase
//     .from('setups')
//     .select('*', { count: 'exact', head: true })
//     .eq('published', false)
//     .is('deleted_at', null)

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white p-4 rounded shadow">
//           <p className="text-gray-500">Total Posts</p>
//           <p className="text-3xl font-bold">{total ?? 0}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <p className="text-gray-500">Published</p>
//           <p className="text-3xl font-bold text-green-600">{published ?? 0}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <p className="text-gray-500">Drafts</p>
//           <p className="text-3xl font-bold text-yellow-600">{drafts ?? 0}</p>
//         </div>
//       </div>
//       <div className="mt-6">
//         <a href="/admin/posts" className="text-blue-600 hover:underline">Manage Posts →</a>
//       </div>
//     </div>
//   )
// }








// app/admin/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()

  // Setup counts
  const { count: totalSetups } = await supabase
    .from('setups')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { count: publishedSetups } = await supabase
    .from('setups')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)
    .is('deleted_at', null)

  const { count: draftSetups } = await supabase
    .from('setups')
    .select('*', { count: 'exact', head: true })
    .eq('published', false)
    .is('deleted_at', null)

  const { count: trashedSetups } = await supabase
    .from('setups')
    .select('*', { count: 'exact', head: true })
    .not('deleted_at', 'is', null)

  // User counts
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: pendingUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: adminUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  // Submission counts
  const { count: pendingSubmissions } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalSubmissions } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })

  // Categories count
  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Posts" value={totalSetups ?? 0} href="/admin/posts" />
        <DashboardCard title="Published" value={publishedSetups ?? 0} color="text-green-600" href="/admin/posts?status=published" />
        <DashboardCard title="Drafts" value={draftSetups ?? 0} color="text-yellow-600" href="/admin/posts?status=draft" />
        <DashboardCard title="Trash" value={trashedSetups ?? 0} color="text-red-600" href="/admin/posts?status=deleted" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard title="Total Users" value={totalUsers ?? 0} href="/admin/users" />
        <DashboardCard title="Pending Users" value={pendingUsers ?? 0} color="text-yellow-600" href="/admin/users?status=pending" />
        <DashboardCard title="Admins" value={adminUsers ?? 0} color="text-purple-600" href="/admin/users" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Total Submissions" value={totalSubmissions ?? 0} href="/admin/submissions" />
        <DashboardCard title="Pending Submissions" value={pendingSubmissions ?? 0} color="text-yellow-600" href="/admin/submissions?status=pending" />
        <DashboardCard title="Categories" value={totalCategories ?? 0} href="/admin/categories" />
      </div>
    </div>
  )
}

// Reusable Dashboard Card
function DashboardCard({
  title,
  value,
  color,
  href,
}: {
  title: string
  value: number
  color?: string
  href?: string
}) {
  return (
    <a
      href={href || '#'}
      className="block bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
    </a>
  )
}


