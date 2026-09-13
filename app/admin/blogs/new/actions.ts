'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createBlog(formData: FormData) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()

  const title = (formData.get('title') as string)?.trim()
  const category_id = (formData.get('category_id') as string) || null
  const short_intro = (formData.get('short_intro') as string)?.trim()
  const content = formData.get('content') as string
  const cover_image_url = (formData.get('cover_image_url') as string)?.trim()
  const meta_title = (formData.get('meta_title') as string)?.trim()
  const meta_description = (formData.get('meta_description') as string)?.trim()
  const published = formData.get('published') === 'on'

  let slug = (formData.get('slug') as string)?.trim()
  if (!slug) slug = slugify(title)

  if (!title || !content) {
    return { error: 'Title aur content zaroori hain' }
  }

  const { error } = await supabase.from('blogs').insert({
    title,
    slug,
    short_intro,
    content,
    cover_image_url,
    category_id: category_id || null,
    meta_title,
    meta_description,
    author_id: user.id,
    published,
    published_at: published ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${slug}`)
  redirect('/admin/blogs')
}