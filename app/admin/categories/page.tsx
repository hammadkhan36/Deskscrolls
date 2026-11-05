// app/admin/categories/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CategoriesTable from './CategoriesTable'

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check role – only admin/manager can manage categories
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager'].includes(profile.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied – Manager or Admin only.</div>
  }

  // Fetch categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    return <div className="p-10 text-center text-red-600">Failed to load categories.</div>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Setup Categories
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Organize desk setups into categories used across the website.
        </p>
      </div>

      <CategoriesTable
        categories={categories ?? []}
        isAdmin={profile.role === 'admin'}
      />
    </div>
  )
}
