'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function togglePublish(setupId: string, currentPublished: boolean) {
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
    .update({
      published: !currentPublished,
      published_at: !currentPublished ? new Date().toISOString() : null,
    })
    .eq('id', setupId)
    .is('deleted_at', null) // can't toggle if deleted

  if (error) throw new Error(error.message)
  revalidatePath('/admin/posts')
}

export async function softDeleteSetup(setupId: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Only admin can soft delete
  if (!profile || profile.role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('setups')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', setupId)
    .is('deleted_at', null)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/posts')
}

export async function restoreSetup(setupId: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('setups')
    .update({ deleted_at: null })
    .eq('id', setupId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/posts')
}