'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createBlogCategory(formData: FormData) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  let slug = (formData.get('slug') as string)?.trim()
  if (!slug) slug = slugify(name)

  if (!name) return { error: 'Name zaroori hai' }

  const { error } = await supabase.from('blog_categories').insert({
    name, slug, description,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/blog-categories')
  return { success: true }
}

export async function updateBlogCategory(id: string, formData: FormData) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim()

  const { error } = await supabase
    .from('blog_categories')
    .update({ name, slug, description })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/blog-categories')
  return { success: true }
}

export async function deleteBlogCategory(id: string) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()
  const { error } = await supabase.from('blog_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/blog-categories')
  return { success: true }
}