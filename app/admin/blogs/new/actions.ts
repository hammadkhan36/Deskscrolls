// 'use server'

// import { createServerSupabase } from '@/lib/supabase/server'
// import { getAdminUser } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'

// function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
// }

// export async function createBlog(formData: FormData) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }

//   const supabase = await createServerSupabase()

//   const title = (formData.get('title') as string)?.trim()
//   const category_id = (formData.get('category_id') as string) || null
//   const short_intro = (formData.get('short_intro') as string)?.trim()
//   const content = formData.get('content') as string
//   const cover_image_url = (formData.get('cover_image_url') as string)?.trim()
//   const meta_title = (formData.get('meta_title') as string)?.trim()
//   const meta_description = (formData.get('meta_description') as string)?.trim()
//   const published = formData.get('published') === 'on'

//   let slug = (formData.get('slug') as string)?.trim()
//   if (!slug) slug = slugify(title)

//   if (!title || !content) {
//     return { error: 'Title aur content zaroori hain' }
//   }

//   const { error } = await supabase.from('blogs').insert({
//     title,
//     slug,
//     short_intro,
//     content,
//     cover_image_url,
//     category_id: category_id || null,
//     meta_title,
//     meta_description,
//     author_id: user.id,
//     published,
//     published_at: published ? new Date().toISOString() : null,
//   })

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   revalidatePath('/blogs')
//   revalidatePath(`/blogs/${slug}`)
//   redirect('/admin/blogs')
// }











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

// ───────────── CREATE ─────────────
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

// ───────────── UPDATE ─────────────
export async function updateBlog(id: string, formData: FormData) {
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

  // Pehle current state dekho — published_at preserve karne ke liye
  const { data: existing } = await supabase
    .from('blogs')
    .select('published, published_at')
    .eq('id', id)
    .single()

  const wasPublished = existing?.published

  const { error } = await supabase
    .from('blogs')
    .update({
      title,
      slug,
      short_intro,
      content,
      cover_image_url,
      category_id: category_id || null,
      meta_title,
      meta_description,
      published,
      // Pehli baar publish ho raha hai to timestamp do
      published_at:
        published && !wasPublished
          ? new Date().toISOString()
          : existing?.published_at || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${slug}`)
  redirect('/admin/blogs')
}

// ───────────── TOGGLE PUBLISH ─────────────
export async function togglePublish(id: string, nextState: boolean) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()

  const { data: existing } = await supabase
    .from('blogs')
    .select('published_at')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('blogs')
    .update({
      published: nextState,
      published_at:
        nextState && !existing?.published_at
          ? new Date().toISOString()
          : existing?.published_at,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  return { success: true }
}

// ───────────── SOFT DELETE ─────────────
export async function softDeleteBlog(id: string) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('blogs')
    .update({ deleted_at: new Date().toISOString(), published: false })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  return { success: true }
}

// ───────────── RESTORE ─────────────
export async function restoreBlog(id: string) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('blogs')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  return { success: true }
}

// ───────────── PERMANENT DELETE ─────────────
export async function hardDeleteBlog(id: string) {
  const user = await getAdminUser()
  if (!user) return { error: 'Not authorized' }

  const supabase = await createServerSupabase()

  const { error } = await supabase.from('blogs').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blogs')
  return { success: true }
}