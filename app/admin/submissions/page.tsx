// app/admin/submissions/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubmissionsTable from './SubmissionsTable'

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager'].includes(profile.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied – Manager or Admin only.</div>
  }

  const statusFilter = status || 'pending'

  let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: submissions } = await query

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Submissions
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Review submitted desk setups and approve or reject them.
        </p>
      </div>

      <SubmissionsTable submissions={submissions ?? []} currentStatus={statusFilter} />
    </div>
  )
}
