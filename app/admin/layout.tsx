import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/admin/Sidebar'

const navLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    roles: ['admin', 'manager', 'author'],
  },
  {
    href: '/admin/posts',
    label: 'Posts',
    roles: ['admin', 'manager', 'author'],
  },
  {
    href: '/admin/blogs',
    label: 'Blogs',
    roles: ['admin', 'manager', 'author'],
  },
  {
    href: '/admin/blog-categories',
    label: 'Blog Categories',
    roles: ['admin', 'manager'],
  },

  // Products ecosystem
  {
  href: '/admin/products',
  label: 'Products',
  roles: ['admin', 'manager'],
},
  
  {
    href: '/admin/brands',
    label: 'Brands',
    roles: ['admin', 'manager'],
  },

  {
    href: '/admin/users',
    label: 'Users',
    roles: ['admin'],
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    roles: ['admin', 'manager'],
  },
  {
    href: '/admin/submissions',
    label: 'Submissions',
    roles: ['admin', 'manager'],
  },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !['admin', 'manager', 'author'].includes(profile.role)
  ) {
    return (
      <div className="p-10 text-center text-red-600">
        Access Denied
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        role={profile.role}
        navLinks={navLinks}
      />

      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  )
}
