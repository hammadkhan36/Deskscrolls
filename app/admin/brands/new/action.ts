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
  const text = typeof value === 'string' ? value.trim() : ''
  return text || null
}

export async function createBrand(formData: FormData) {
  const user = await getAdminUser()

  if (!user) {
    return { error: 'Not authorized' }
  }

  const name = optionalText(formData.get('name'))

  if (!name) {
    return { error: 'Brand name zaroori hai' }
  }

  const suppliedSlug = optionalText(formData.get('slug'))
  const slug = slugify(suppliedSlug || name)

  if (!slug) {
    return { error: 'Valid slug generate nahi ho saka' }
  }

  const published = formData.get('published') === 'on'
  const featured = formData.get('featured') === 'on'

  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('brands')
    .insert({
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
      published_at: published
        ? new Date().toISOString()
        : null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/brands')

  redirect('/admin/brands')
}
