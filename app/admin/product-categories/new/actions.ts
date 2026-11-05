'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/auth'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function optionalText(
  value: FormDataEntryValue | null
) {
  const text =
    typeof value === 'string'
      ? value.trim()
      : ''

  return text || null
}

export async function createProductCategory(
  formData: FormData
) {
  const user = await getAdminUser()

  if (!user) {
    return {
      error: 'Not authorized',
    }
  }

  const name = optionalText(
    formData.get('name')
  )

  const suppliedSlug = optionalText(
    formData.get('slug')
  )

  if (!name) {
    return {
      error: 'Category name zaroori hai',
    }
  }

  if (!suppliedSlug) {
    return {
      error: 'Slug zaroori hai',
    }
  }

  const slug = slugify(suppliedSlug)

  if (!slug) {
    return {
      error: 'Valid slug zaroori hai',
    }
  }

  const parentId = optionalText(
    formData.get('parent_id')
  )

  const sortOrderValue = optionalText(
    formData.get('sort_order')
  )

  const parsedSortOrder =
    sortOrderValue !== null
      ? Number.parseInt(sortOrderValue, 10)
      : 0

  const sortOrder =
    Number.isFinite(parsedSortOrder) &&
    parsedSortOrder >= 0
      ? parsedSortOrder
      : 0

  const published =
    formData.get('published') === 'on'

  const supabase =
    await createServerSupabase()

  /*
   * Validate parent instead of trusting
   * the submitted UUID.
   */
  if (parentId) {
    const { data: parent } = await supabase
      .from('product_categories')
      .select('id')
      .eq('id', parentId)
      .maybeSingle()

    if (!parent) {
      return {
        error: 'Selected parent category valid nahi hai',
      }
    }
  }

  const { error } = await supabase
    .from('product_categories')
    .insert({
      name,
      slug,

      description: optionalText(
        formData.get('description')
      ),

      parent_id: parentId,

      meta_title: optionalText(
        formData.get('meta_title')
      ),

      meta_description: optionalText(
        formData.get('meta_description')
      ),

      published,
      sort_order: sortOrder,
    })

  if (error) {
    if (error.code === '23505') {
      return {
        error:
          'Is name ya slug ke saath category pehle se mojood hai',
      }
    }

    return {
      error: error.message,
    }
  }

  revalidatePath(
    '/admin/product-categories'
  )

  revalidatePath('/products')

  revalidatePath('/sitemap.xml')

  redirect('/admin/product-categories')
        }
