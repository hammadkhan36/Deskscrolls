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

function getCategoryData(formData: FormData) {
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

  const primaryCategoryId = optionalText(
    formData.get('primary_category_id')
  )

  return {
    categoryIds,
    primaryCategoryId,
  }
}

function validateCategories(
  categoryIds: string[],
  primaryCategoryId: string | null
) {
  if (categoryIds.length === 0) {
    return 'Kam az kam aik product category select karo'
  }

  if (
    !primaryCategoryId ||
    !categoryIds.includes(primaryCategoryId)
  ) {
    return 'Primary category select karo'
  }

  return null
}

function getProductFields(formData: FormData) {
  const name = optionalText(formData.get('name'))

  const suppliedSlug = optionalText(
    formData.get('slug')
  )

  const slug = name
    ? slugify(suppliedSlug || name)
    : ''

  const productType =
    optionalText(formData.get('product_type')) ||
    'affiliate'

  const published =
    formData.get('published') === 'on'

  const featured =
    formData.get('featured') === 'on'

  const sponsored =
    formData.get('sponsored') === 'on'

  return {
    name,
    slug,
    productType,
    published,
    featured,
    sponsored,

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

    price_text: optionalText(
      formData.get('price_text')
    ),

    buy_url: optionalText(
      formData.get('buy_url')
    ),

    cta_text:
      optionalText(formData.get('cta_text')) ||
      'View Product',

    meta_title: optionalText(
      formData.get('meta_title')
    ),

    meta_description: optionalText(
      formData.get('meta_description')
    ),
  }
}

// ───────────── CREATE ─────────────

export async function createProduct(
  formData: FormData
) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const fields = getProductFields(formData)

  if (!fields.name) {
    return { error: 'Product name zaroori hai' }
  }

  if (!fields.slug) {
    return {
      error: 'Valid slug generate nahi ho saka',
    }
  }

  if (
    !['affiliate', 'digital', 'standard'].includes(
      fields.productType
    )
  ) {
    return { error: 'Invalid product type' }
  }

  const {
    categoryIds,
    primaryCategoryId,
  } = getCategoryData(formData)

  const categoryValidation = validateCategories(
    categoryIds,
    primaryCategoryId
  )

  if (categoryValidation) {
    return { error: categoryValidation }
  }

  const supabase =
    await createServerSupabase()

  const { data: product, error: productError } =
    await supabase
      .from('products')
      .insert({
        name: fields.name,
        slug: fields.slug,
        brand_id: fields.brand_id,
        short_description:
          fields.short_description,
        content: fields.content,
        cover_image_url:
          fields.cover_image_url,
        product_type: fields.productType,
        price_text: fields.price_text,
        buy_url: fields.buy_url,
        cta_text: fields.cta_text,
        meta_title: fields.meta_title,
        meta_description:
          fields.meta_description,
        published: fields.published,
        featured: fields.featured,
        sponsored: fields.sponsored,
        published_at: fields.published
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
    await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    return {
      error:
        `Product categories save nahi huin: ${categoryError.message}`,
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')

  redirect('/admin/products')
}

// ───────────── UPDATE ─────────────

export async function updateProduct(
  id: string,
  formData: FormData
) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const fields = getProductFields(formData)

  if (!fields.name) {
    return { error: 'Product name zaroori hai' }
  }

  if (!fields.slug) {
    return { error: 'Valid slug zaroori hai' }
  }

  if (
    !['affiliate', 'digital', 'standard'].includes(
      fields.productType
    )
  ) {
    return { error: 'Invalid product type' }
  }

  const {
    categoryIds,
    primaryCategoryId,
  } = getCategoryData(formData)

  const categoryValidation = validateCategories(
    categoryIds,
    primaryCategoryId
  )

  if (categoryValidation) {
    return { error: categoryValidation }
  }

  const supabase =
    await createServerSupabase()

  const { data: existing } = await supabase
    .from('products')
    .select('published, published_at')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()

  if (!existing) {
    return { error: 'Product nahi mila' }
  }

  let publishedAt = existing.published_at

  if (fields.published && !existing.published) {
    publishedAt = new Date().toISOString()
  }

  if (!fields.published) {
    publishedAt = null
  }

  const { error: updateError } =
    await supabase
      .from('products')
      .update({
        name: fields.name,
        slug: fields.slug,
        brand_id: fields.brand_id,
        short_description:
          fields.short_description,
        content: fields.content,
        cover_image_url:
          fields.cover_image_url,
        product_type: fields.productType,
        price_text: fields.price_text,
        buy_url: fields.buy_url,
        cta_text: fields.cta_text,
        meta_title: fields.meta_title,
        meta_description:
          fields.meta_description,
        published: fields.published,
        featured: fields.featured,
        sponsored: fields.sponsored,
        published_at: publishedAt,
      })
      .eq('id', id)
      .is('deleted_at', null)

  if (updateError) {
    return { error: updateError.message }
  }

  // Replace existing category relationships
  const { error: deleteLinksError } =
    await supabase
      .from('product_category_links')
      .delete()
      .eq('product_id', id)

  if (deleteLinksError) {
    return {
      error:
        `Old categories update nahi huin: ${deleteLinksError.message}`,
    }
  }

  const categoryLinks = categoryIds.map(
    (categoryId) => ({
      product_id: id,
      category_id: categoryId,
      is_primary:
        categoryId === primaryCategoryId,
    })
  )

  const { error: insertLinksError } =
    await supabase
      .from('product_category_links')
      .insert(categoryLinks)

  if (insertLinksError) {
    return {
      error:
        `New categories save nahi huin: ${insertLinksError.message}`,
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${fields.slug}`)

  redirect('/admin/products')
}

// ───────────── SOFT DELETE ─────────────

export async function softDeleteProduct(
  id: string
) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const supabase =
    await createServerSupabase()

  const { error } = await supabase
    .from('products')
    .update({
      deleted_at: new Date().toISOString(),
      published: false,
      featured: false,
      sponsored: false,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')

  return { success: true }
  }
