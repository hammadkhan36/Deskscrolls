'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Toggle published status
export async function togglePublish(setupId: string, currentPublished: boolean) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Optionally check role (admin/author)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('setups')
    .update({
      published: !currentPublished,
      published_at: !currentPublished ? new Date().toISOString() : null,
    })
    .eq('id', setupId)

  if (error) throw new Error(error.message)

  // Revalidate admin page cache
  revalidatePath('/admin')
  return { success: true }
}

// Delete setup
export async function deleteSetup(setupId: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('setups')
    .delete()
    .eq('id', setupId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  return { success: true }
}