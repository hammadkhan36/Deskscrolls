import { createServerSupabase } from '../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // check role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
    return <div className="p-10 text-center text-red-600">You are not authorized to access this area.</div>
  }

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">Admin Navbar (logout button etc.)</nav>
      {children}
    </div>
  )
}