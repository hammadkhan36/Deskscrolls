// app/admin/submissions/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubmissionsTable from './SubmissionsTable'

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager'].includes(profile.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied – Manager or Admin only.</div>
  }

  const statusFilter = searchParams.status || 'pending'

  let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: submissions } = await query

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      <SubmissionsTable submissions={submissions ?? []} currentStatus={statusFilter} />
    </div>
  )
}