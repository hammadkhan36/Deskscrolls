// 'use server'

// import { revalidatePath } from 'next/cache'
// import { getAdminUser } from '@/lib/auth'
// import { createServerSupabaseActionClient } from '@/lib/supabase/server'
// import { syncSetupProducts, type SetupProductOption } from '@/lib/setup-products'

// export async function getSetupProductOptions() {
//   if (!await getAdminUser()) return { error: 'Not authorized' }
//   const supabase = await createServerSupabaseActionClient()
//   const products: SetupProductOption[] = []
//   // Paginate rather than silently dropping products at the API row limit.
//   for (let offset = 0; ; offset += 500) {
//     const { data, error } = await supabase.from('products')
//       .select('id, name, published').is('deleted_at', null)
//       .order('name').order('id').range(offset, offset + 499)
//     if (error) return { error: `Could not load products: ${error.message}` }
//     products.push(...(data || []))
//     if (!data || data.length < 500) break
//   }
//   return { products }
// }

// export async function saveSetupProducts(setupId: string, productIds: string[]) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }
//   const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//   if (typeof setupId !== 'string' || !uuid.test(setupId) ||
//       !Array.isArray(productIds) || productIds.length > 500 ||
//       productIds.some(id => typeof id !== 'string' || !uuid.test(id))) {
//     return { error: 'Invalid setup or product selection (maximum 500 products).' }
//   }
//   const supabase = await createServerSupabaseActionClient()
//   const { data: setup, error } = await supabase.from('setups')
//     .select('id, slug, author_id').eq('id', setupId).is('deleted_at', null).maybeSingle()
//   if (error || !setup) return { error: 'Setup not found or not accessible.' }
//   const { data: profile } = await supabase.from('profiles')
//     .select('role').eq('id', user.id).single()
//   if (!profile || !['admin', 'manager', 'author'].includes(profile.role) ||
//       (profile.role === 'author' && setup.author_id !== user.id)) {
//     return { error: 'Not authorized to edit this setup.' }
//   }
//   try {
//     await syncSetupProducts(supabase, setupId, productIds)
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Could not save setup products.' }
//   }
//   revalidatePath(`/setups/${setup.slug}`)
//   revalidatePath(`/admin/edit/${setupId}`)
//   revalidatePath('/admin/posts')
//   return { success: true }
// }







'use server'

import { revalidatePath } from 'next/cache'
import { getAdminUser } from '@/lib/auth'
import { createServerSupabaseActionClient } from '@/lib/supabase/server'
import {
  syncSetupProducts,
  type SetupProductOption,
} from '@/lib/setup-products'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const PRODUCTS_PAGE_SIZE = 500
const MAX_SELECTED_PRODUCTS = 500

export async function getSetupProductOptions() {
  const user = await getAdminUser()

  if (!user) {
    return {
      error: 'Not authorized',
      products: [] as SetupProductOption[],
    }
  }

  const supabase = await createServerSupabaseActionClient()
  const products: SetupProductOption[] = []

  // Pagination prevents Supabase API row limits from hiding products.
  for (
    let offset = 0;
    ;
    offset += PRODUCTS_PAGE_SIZE
  ) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, published')
      .is('deleted_at', null)
      .order('name', { ascending: true })
      .order('id', { ascending: true })
      .range(
        offset,
        offset + PRODUCTS_PAGE_SIZE - 1
      )

    if (error) {
      return {
        error: `Could not load products: ${error.message}`,
        products: [] as SetupProductOption[],
      }
    }

    products.push(...(data || []))

    if (!data || data.length < PRODUCTS_PAGE_SIZE) {
      break
    }
  }

  return { products }
}

export async function saveSetupProducts(
  setupId: string,
  productIds: string[]
) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  if (
    typeof setupId !== 'string' ||
    !UUID_PATTERN.test(setupId)
  ) {
    return { error: 'Invalid setup ID.' }
  }

  if (
    !Array.isArray(productIds) ||
    productIds.length > MAX_SELECTED_PRODUCTS ||
    productIds.some(
      (productId) =>
        typeof productId !== 'string' ||
        !UUID_PATTERN.test(productId)
    )
  ) {
    return {
      error:
        'Invalid product selection. A maximum of 500 products is allowed.',
    }
  }

  // Remove duplicate IDs before syncing the relationship table.
  const uniqueProductIds = Array.from(
    new Set(productIds)
  )

  const supabase =
    await createServerSupabaseActionClient()

  const {
    data: setup,
    error: setupError,
  } = await supabase
    .from('setups')
    .select('id, slug, author_id')
    .eq('id', setupId)
    .is('deleted_at', null)
    .maybeSingle()

  if (setupError) {
    return {
      error: `Could not load setup: ${setupError.message}`,
    }
  }

  if (!setup) {
    return {
      error: 'Setup not found or not accessible.',
    }
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      error: 'Could not verify your permissions.',
    }
  }

  const allowedRoles = [
    'admin',
    'manager',
    'author',
  ]

  if (!allowedRoles.includes(profile.role)) {
    return {
      error: 'Not authorized to edit this setup.',
    }
  }

  if (
    profile.role === 'author' &&
    setup.author_id !== user.id
  ) {
    return {
      error: 'Not authorized to edit this setup.',
    }
  }

  try {
    await syncSetupProducts(
      supabase,
      setupId,
      uniqueProductIds
    )
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Could not save setup products.',
    }
  }

  // Refresh the setup detail page.
  revalidatePath(`/setups/${setup.slug}`)

  // Refresh setup listing pages.
  revalidatePath('/setups')
  revalidatePath('/admin/posts')
  revalidatePath(`/admin/edit/${setupId}`)

  // Product detail pages contain:
  // "Setups using this product"
  revalidatePath('/products', 'layout')

  // Homepage may display featured setups/products.
  revalidatePath('/')

  return { success: true }
}
