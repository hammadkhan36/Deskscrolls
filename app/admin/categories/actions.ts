// app/admin/categories/actions.ts
'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCategory(name: string, description: string | null) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager'].includes(profile.role)) throw new Error('Unauthorized')

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { error } = await supabase.from('categories').insert({ name, slug, description })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, name: string, description: string | null) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager'].includes(profile.role)) throw new Error('Unauthorized')

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { error } = await supabase.from('categories').update({ name, slug, description }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') throw new Error('Admin only')

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
}