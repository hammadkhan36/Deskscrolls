'use server'

import { revalidatePath } from 'next/cache'
import { getAdminUser } from '@/lib/auth'
import { createServerSupabaseActionClient } from '@/lib/supabase/server'
import { syncSetupProducts, type SetupProductOption } from '@/lib/setup-products'

export async function getSetupProductOptions() {
  if (!await getAdminUser()) return { error: 'Not authorized' }
  const supabase = await createServerSupabaseActionClient()
  const products: SetupProductOption[] = []
  // Paginate rather than silently dropping products at the API row limit.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('products')
      .select('id, name, published').is('deleted_at', null)
      .order('name').order('id').range(offset, offset + 499)
    if (error) return { error: `Could not load products: ${error.message}` }
    products.push(...(data || []))
    if (!data || data.length < 500) break
  }
  return { products }
}

export async function saveSetupProducts(setupId: string, productIds: string[]) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (typeof setupId !== 'string' || !uuid.test(setupId) ||
      !Array.isArray(productIds) || productIds.length > 500 ||
      productIds.some(id => typeof id !== 'string' || !uuid.test(id))) {
    return { error: 'Invalid setup or product selection (maximum 500 products).' }
  }
  const supabase = await createServerSupabaseActionClient()
  const { data: setup, error } = await supabase.from('setups')
    .select('id, slug, author_id').eq('id', setupId).is('deleted_at', null).maybeSingle()
  if (error || !setup) return { error: 'Setup not found or not accessible.' }
  const { data: profile } = await supabase.from('profiles')
    .select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'manager', 'author'].includes(profile.role) ||
      (profile.role === 'author' && setup.author_id !== user.id)) {
    return { error: 'Not authorized to edit this setup.' }
  }
  try {
    await syncSetupProducts(supabase, setupId, productIds)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not save setup products.' }
  }
  revalidatePath(`/setups/${setup.slug}`)
  revalidatePath(`/admin/edit/${setupId}`)
  revalidatePath('/admin/posts')
  return { success: true }
}
