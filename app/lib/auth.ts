import { createServerSupabase } from '@/lib/supabase/server'

export async function getAdminUser() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager', 'author'].includes(profile.role)) {
    return null
  }
  return user
}