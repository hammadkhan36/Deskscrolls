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

function optionalText(value: FormDataEntryValue | null) {
  const text =
    typeof value === 'string'
      ? value.trim()
      : ''

  return text || null
}

export async function createProduct(formData: FormData) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const name = optionalText(formData.get('name'))

  if (!name) {
    return { error: 'Product name zaroori hai' }
  }

  const suppliedSlug = optionalText(
    formData.get('slug')
  )

  const slug = slugify(
    suppliedSlug || name
  )

  if (!slug) {
    return { error: 'Valid slug generate nahi ho saka' }
  }

  const productType =
    optionalText(formData.get('product_type')) ||
    'affiliate'

  if (
    !['affiliate', 'digital', 'standard'].includes(
      productType
    )
  ) {
    return { error: 'Invalid product type' }
  }

  const categoryIds = [
    ...new Set(
      formData
        .getAll('category_ids')
        .filter(
          (value): value is string =>
            typeof value === 'string' &&
            value.trim().length > 0
        )
        .map((value) => value.trim())
    ),
  ]

  const primaryCategoryId =
    optionalText(
      formData.get('primary_category_id')
    )

  if (categoryIds.length === 0) {
    return {
      error: 'Kam az kam aik product category select karo',
    }
  }

  if (
    !primaryCategoryId ||
    !categoryIds.includes(primaryCategoryId)
  ) {
    return {
      error: 'Primary category select karo',
    }
  }

  const published =
    formData.get('published') === 'on'

  const featured =
    formData.get('featured') === 'on'

  const sponsored =
    formData.get('sponsored') === 'on'

  const supabase =
    await createServerSupabase()

  // Create main product
  const { data: product, error: productError } =
    await supabase
      .from('products')
      .insert({
        name,
        slug,

        brand_id: optionalText(
          formData.get('brand_id')
        ),

        short_description: optionalText(
          formData.get('short_description')
        ),

        content: optionalText(
          formData.get('content')
        ),

        cover_image_url: optionalText(
          formData.get('cover_image_url')
        ),

        product_type: productType,

        price_text: optionalText(
          formData.get('price_text')
        ),

        buy_url: optionalText(
          formData.get('buy_url')
        ),

        cta_text:
          optionalText(
            formData.get('cta_text')
          ) || 'View Product',

        meta_title: optionalText(
          formData.get('meta_title')
        ),

        meta_description: optionalText(
          formData.get('meta_description')
        ),

        published,
        featured,
        sponsored,

        published_at: published
          ? new Date().toISOString()
          : null,
      })
      .select('id')
      .single()

  if (productError || !product) {
    return {
      error:
        productError?.message ||
        'Product create nahi ho saka',
    }
  }

  // Create category relationships
  const categoryLinks = categoryIds.map(
    (categoryId) => ({
      product_id: product.id,
      category_id: categoryId,
      is_primary:
        categoryId === primaryCategoryId,
    })
  )

  const { error: categoryError } =
    await supabase
      .from('product_category_links')
      .insert(categoryLinks)

  if (categoryError) {
    // Cleanup product if category linking fails.
    // Prevents a half-created product from remaining.
    await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    return {
      error: `Product categories save nahi huin: ${categoryError.message}`,
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')

  redirect('/admin/products')
        }
