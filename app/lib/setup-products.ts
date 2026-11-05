import type { SupabaseClient } from '@supabase/supabase-js'

export type SetupProductOption = {
  id: string
  name: string
  published: boolean | null
}

export type SetupProductLink = {
  product_id: string
  sort_order: number | null
}

// Retained links are never rewritten: notes, created_at and custom order survive.
// Insert first so a failed addition cannot erase the previous selection.
export async function syncSetupProducts(
  supabase: SupabaseClient,
  setupId: string,
  productIds: string[],
) {
  const selected = [...new Set(productIds)]
  const { data: existing, error: readError } = await supabase
    .from('setup_products')
    .select('product_id, sort_order')
    .eq('setup_id', setupId)
  if (readError) throw new Error(`Could not load setup products: ${readError.message}`)

  const links = (existing || []) as SetupProductLink[]
  const existingIds = new Set(links.map(link => link.product_id))
  const additions = selected.filter(id => !existingIds.has(id))
  const removals = links.filter(link => !selected.includes(link.product_id))

  if (additions.length) {
    const { data: products, error } = await supabase.from('products')
      .select('id').in('id', additions).is('deleted_at', null)
    if (error) throw new Error(`Could not validate products: ${error.message}`)
    if (products?.length !== additions.length) {
      throw new Error('A selected product is unavailable. Reload the products and try again.')
    }
    const firstOrder = Math.max(-1, ...links.map(link => link.sort_order ?? 0)) + 1
    const { error: insertError } = await supabase.from('setup_products').upsert(
      additions.map((id, index) => ({
        setup_id: setupId, product_id: id, sort_order: firstOrder + index,
      })),
      { onConflict: 'setup_id,product_id', ignoreDuplicates: true },
    )
    if (insertError) throw new Error(`Could not add setup products: ${insertError.message}`)
  }

  if (removals.length) {
    const { error } = await supabase.from('setup_products').delete()
      .eq('setup_id', setupId).in('product_id', removals.map(link => link.product_id))
    if (error) throw new Error(`Could not remove setup products. Some additions may have saved; retry saving: ${error.message}`)
  }

  // RLS can silently filter a deletion; never report success without reading back.
  const { data: saved, error: verifyError } = await supabase.from('setup_products')
    .select('product_id').eq('setup_id', setupId)
  if (verifyError) throw new Error(`Could not verify setup products: ${verifyError.message}`)
  if (saved?.length !== selected.length || saved.some(link => !selected.includes(link.product_id))) {
    throw new Error('Products did not fully save. Check your permissions or reload before trying again.')
  }
}
