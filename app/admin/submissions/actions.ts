// app/admin/submissions/actions.ts
'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSubmissionStatus(id: string, status: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('submissions').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/submissions')
}