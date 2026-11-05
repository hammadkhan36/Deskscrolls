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

export async function updateProductCategory(
  id: string,
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

  if (parentId === id) {
    return {
      error:
        'Category khud apni parent nahi ho sakti',
    }
  }

  const sortOrderValue = optionalText(
    formData.get('sort_order')
  )

  const parsedSortOrder =
    sortOrderValue !== null
      ? Number.parseInt(
          sortOrderValue,
          10
        )
      : 0

  const sortOrder =
    Number.isFinite(
      parsedSortOrder
    ) && parsedSortOrder >= 0
      ? parsedSortOrder
      : 0

  const published =
    formData.get('published') === 'on'

  const supabase =
    await createServerSupabase()

  /*
   * Validate selected parent.
   */
  if (parentId) {
    const { data: parent } =
      await supabase
        .from('product_categories')
        .select('id, parent_id')
        .eq('id', parentId)
        .maybeSingle()

    if (!parent) {
      return {
        error:
          'Selected parent category valid nahi hai',
      }
    }

    /*
     * Prevent the simplest circular case:
     *
     * A -> B
     * then B -> A
     */
    if (parent.parent_id === id) {
      return {
        error:
          'Circular parent relationship allowed nahi hai',
      }
    }
  }

  const { error } = await supabase
    .from('product_categories')
    .update({
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
        formData.get(
          'meta_description'
        )
      ),

      published,
      sort_order: sortOrder,
    })
    .eq('id', id)

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

  revalidatePath(
    `/products/category/${slug}`
  )

  revalidatePath('/sitemap.xml')

  redirect(
    '/admin/product-categories'
  )
}

export async function deleteProductCategory(
  id: string
) {
  const user = await getAdminUser()

  if (!user) {
    return {
      error: 'Not authorized',
    }
  }

  const supabase =
    await createServerSupabase()

  /*
   * Do not delete a category that still
   * contains products.
   */
  const {
    count: productCount,
    error: productsError,
  } = await supabase
    .from('product_category_links')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('category_id', id)

  if (productsError) {
    return {
      error: productsError.message,
    }
  }

  if ((productCount || 0) > 0) {
    return {
      error:
        'Is category mein products hain. Pehle products ko kisi aur category mein move karo.',
    }
  }

  /*
   * Do not delete a parent while it
   * still has child categories.
   */
  const {
    count: childCount,
    error: childrenError,
  } = await supabase
    .from('product_categories')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('parent_id', id)

  if (childrenError) {
    return {
      error: childrenError.message,
    }
  }

  if ((childCount || 0) > 0) {
    return {
      error:
        'Is category ki child categories hain. Pehle unka parent change karo.',
    }
  }

  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(
    '/admin/product-categories'
  )

  revalidatePath('/products')
  revalidatePath('/sitemap.xml')

  redirect(
    '/admin/product-categories'
  )
      }
