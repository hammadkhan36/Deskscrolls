// // import { createServerSupabase } from '../lib/supabase/server'
// // import { redirect } from 'next/navigation'

// // export default async function AdminLayout({ children }: { children: React.ReactNode }) {
// //   const supabase = await createServerSupabase()
// //   const { data: { user } } = await supabase.auth.getUser()
// //   if (!user) redirect('/login')

// //   // check role from profiles table
// //   const { data: profile } = await supabase
// //     .from('profiles')
// //     .select('role')
// //     .eq('id', user.id)
// //     .single()

// //   if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
// //     return <div className="p-10 text-center text-red-600">You are not authorized to access this area.</div>
// //   }

// //   return (
// //     <div>
// //       <nav className="bg-gray-800 text-white p-4">Admin Navbar (logout button etc.)</nav>
// //       {children}
// //     </div>
// //   )
// // }















// // app/admin/layout.tsx
// import { createServerSupabase } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'

// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const supabase = await createServerSupabase()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) redirect('/login')

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (!profile || (profile.role !== 'admin' && profile.role !== 'manager' && profile.role !== 'author')) {
//     return <div className="p-10 text-center text-red-600">You are not authorized to access this area.</div>
//   }

//   // Sidebar navigation links based on role
//   const navLinks = [
//     { href: '/admin', label: 'Dashboard', roles: ['admin', 'manager', 'author'] },
//     { href: '/admin/posts', label: 'Posts', roles: ['admin', 'manager', 'author'] },
//     { href: '/admin/users', label: 'Users', roles: ['admin'] },
//     { href: '/admin/categories', label: 'Categories', roles: ['admin', 'manager'] },
//     { href: '/admin/submissions', label: 'Submissions', roles: ['admin', 'manager'] },
//   ]

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col">
//         <div className="p-4 border-b border-gray-700">
//           <h2 className="text-xl font-bold">DeskScrolls Admin</h2>
//           <p className="text-sm text-gray-400 mt-1">{profile.role}</p>
//         </div>
//         <nav className="flex-1 p-4 space-y-1">
//           {navLinks
//             .filter(link => link.roles.includes(profile.role))
//             .map(link => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//         </nav>
//         <div className="p-4 border-t border-gray-700">
//           <form action="/auth/signout" method="post">
//             <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 rounded">
//               Sign out
//             </button>
//           </form>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   )
// }





















// import { createServerSupabase } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation'
// import Sidebar from '@/admin/Sidebar'

// const navLinks = [
//   { href: '/admin', label: 'Dashboard', roles: ['admin', 'manager', 'author'] },
//   { href: '/admin/posts', label: 'Posts', roles: ['admin', 'manager', 'author'] },
//   { href: '/admin/users', label: 'Users', roles: ['admin'] },
//   { href: '/admin/categories', label: 'Categories', roles: ['admin', 'manager'] },
//   { href: '/admin/submissions', label: 'Submissions', roles: ['admin', 'manager'] },
// ]

// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const supabase = await createServerSupabase()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) redirect('/login')

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (!profile || !['admin', 'manager', 'author'].includes(profile.role)) {
//     return <div className="p-10 text-center text-red-600">You are not authorized to access this area.</div>
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar role={profile.role} navLinks={navLinks} />
//       <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   )
// }







import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/admin/Sidebar'

const navLinks = [
  { href: '/admin', label: 'Dashboard', roles: ['admin', 'manager', 'author'] },
  { href: '/admin/posts', label: 'Posts', roles: ['admin', 'manager', 'author'] },
  { href: '/admin/users', label: 'Users', roles: ['admin'] },
  { href: '/admin/categories', label: 'Categories', roles: ['admin', 'manager'] },
  { href: '/admin/submissions', label: 'Submissions', roles: ['admin', 'manager'] },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager', 'author'].includes(profile.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={profile.role} navLinks={navLinks} />
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  )
}