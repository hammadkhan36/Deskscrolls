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
  const text = typeof value === 'string'
    ? value.trim()
    : ''

  return text || null
}

export async function updateBrand(
  id: string,
  formData: FormData
) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const name = optionalText(formData.get('name'))
  const suppliedSlug = optionalText(formData.get('slug'))

  if (!name) {
    return { error: 'Brand name zaroori hai' }
  }

  if (!suppliedSlug) {
    return { error: 'Slug zaroori hai' }
  }

  const slug = slugify(suppliedSlug)

  if (!slug) {
    return { error: 'Valid slug zaroori hai' }
  }

  const published =
    formData.get('published') === 'on'

  const featured =
    formData.get('featured') === 'on'

  const supabase = await createServerSupabase()

  const { data: currentBrand } = await supabase
    .from('brands')
    .select('published, published_at')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()

  if (!currentBrand) {
    return { error: 'Brand nahi mila' }
  }

  let publishedAt = currentBrand.published_at

  if (published && !currentBrand.published) {
    publishedAt = new Date().toISOString()
  }

  if (!published) {
    publishedAt = null
  }

  const { error } = await supabase
    .from('brands')
    .update({
      name,
      slug,

      short_description: optionalText(
        formData.get('short_description')
      ),

      description: optionalText(
        formData.get('description')
      ),

      logo_url: optionalText(
        formData.get('logo_url')
      ),

      cover_image_url: optionalText(
        formData.get('cover_image_url')
      ),

      website_url: optionalText(
        formData.get('website_url')
      ),

      meta_title: optionalText(
        formData.get('meta_title')
      ),

      meta_description: optionalText(
        formData.get('meta_description')
      ),

      published,
      featured,
      published_at: publishedAt,
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/brands')
  revalidatePath(`/brands/${slug}`)

  redirect('/admin/brands')
}

export async function deleteBrand(id: string) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('brands')
    .update({
      deleted_at: new Date().toISOString(),
      published: false,
      featured: false,
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/brands')

  redirect('/admin/brands')
}
