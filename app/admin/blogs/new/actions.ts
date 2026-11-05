

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

// // ───────────── CREATE ─────────────
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

// // ───────────── UPDATE ─────────────
// export async function updateBlog(id: string, formData: FormData) {
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

//   // Pehle current state dekho — published_at preserve karne ke liye
//   const { data: existing } = await supabase
//     .from('blogs')
//     .select('published, published_at')
//     .eq('id', id)
//     .single()

//   const wasPublished = existing?.published

//   const { error } = await supabase
//     .from('blogs')
//     .update({
//       title,
//       slug,
//       short_intro,
//       content,
//       cover_image_url,
//       category_id: category_id || null,
//       meta_title,
//       meta_description,
//       published,
//       // Pehli baar publish ho raha hai to timestamp do
//       published_at:
//         published && !wasPublished
//           ? new Date().toISOString()
//           : existing?.published_at || null,
//     })
//     .eq('id', id)

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   revalidatePath('/blogs')
//   revalidatePath(`/blogs/${slug}`)
//   redirect('/admin/blogs')
// }

// // ───────────── TOGGLE PUBLISH ─────────────
// export async function togglePublish(id: string, nextState: boolean) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }

//   const supabase = await createServerSupabase()

//   const { data: existing } = await supabase
//     .from('blogs')
//     .select('published_at')
//     .eq('id', id)
//     .single()

//   const { error } = await supabase
//     .from('blogs')
//     .update({
//       published: nextState,
//       published_at:
//         nextState && !existing?.published_at
//           ? new Date().toISOString()
//           : existing?.published_at,
//     })
//     .eq('id', id)

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   revalidatePath('/blogs')
//   return { success: true }
// }

// // ───────────── SOFT DELETE ─────────────
// export async function softDeleteBlog(id: string) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }

//   const supabase = await createServerSupabase()

//   const { error } = await supabase
//     .from('blogs')
//     .update({ deleted_at: new Date().toISOString(), published: false })
//     .eq('id', id)

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   revalidatePath('/blogs')
//   return { success: true }
// }

// // ───────────── RESTORE ─────────────
// export async function restoreBlog(id: string) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }

//   const supabase = await createServerSupabase()

//   const { error } = await supabase
//     .from('blogs')
//     .update({ deleted_at: null })
//     .eq('id', id)

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   return { success: true }
// }

// // ───────────── PERMANENT DELETE ─────────────
// export async function hardDeleteBlog(id: string) {
//   const user = await getAdminUser()
//   if (!user) return { error: 'Not authorized' }

//   const supabase = await createServerSupabase()

//   const { error } = await supabase.from('blogs').delete().eq('id', id)

//   if (error) return { error: error.message }

//   revalidatePath('/admin/blogs')
//   return { success: true }
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

// ───────────── RELATIONSHIP HELPERS ─────────────
type SupabaseServerClient = Awaited<
  ReturnType<typeof createServerSupabase>
>

function getSelectedIds(formData: FormData, fieldName: string) {
  return Array.from(
    new Set(
      formData
        .getAll(fieldName)
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  )
}

async function saveBlogRelationships(
  supabase: SupabaseServerClient,
  blogId: string,
  productIds: string[],
  brandIds: string[],
  setupIds: string[]
) {
  // Products
  const { error: deleteProductsError } = await supabase
    .from('blog_products')
    .delete()
    .eq('blog_id', blogId)

  if (deleteProductsError) {
    return `Related products update nahi ho sake: ${deleteProductsError.message}`
  }

  if (productIds.length > 0) {
    const { error: insertProductsError } = await supabase
      .from('blog_products')
      .insert(
        productIds.map((productId) => ({
          blog_id: blogId,
          product_id: productId,
        }))
      )

    if (insertProductsError) {
      return `Related products save nahi ho sake: ${insertProductsError.message}`
    }
  }

  // Brands
  const { error: deleteBrandsError } = await supabase
    .from('blog_brands')
    .delete()
    .eq('blog_id', blogId)

  if (deleteBrandsError) {
    return `Related brands update nahi ho sake: ${deleteBrandsError.message}`
  }

  if (brandIds.length > 0) {
    const { error: insertBrandsError } = await supabase
      .from('blog_brands')
      .insert(
        brandIds.map((brandId) => ({
          blog_id: blogId,
          brand_id: brandId,
        }))
      )

    if (insertBrandsError) {
      return `Related brands save nahi ho sake: ${insertBrandsError.message}`
    }
  }

  // Setups
  const { error: deleteSetupsError } = await supabase
    .from('blog_setups')
    .delete()
    .eq('blog_id', blogId)

  if (deleteSetupsError) {
    return `Related setups update nahi ho sake: ${deleteSetupsError.message}`
  }

  if (setupIds.length > 0) {
    const { error: insertSetupsError } = await supabase
      .from('blog_setups')
      .insert(
        setupIds.map((setupId) => ({
          blog_id: blogId,
          setup_id: setupId,
        }))
      )

    if (insertSetupsError) {
      return `Related setups save nahi ho sake: ${insertSetupsError.message}`
    }
  }

  return null
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

  const productIds = getSelectedIds(formData, 'product_ids')
  const brandIds = getSelectedIds(formData, 'brand_ids')
  const setupIds = getSelectedIds(formData, 'setup_ids')

  let slug = (formData.get('slug') as string)?.trim()
  if (!slug) slug = slugify(title)

  if (!title || !content) {
    return { error: 'Title aur content zaroori hain' }
  }

  const { data: blog, error } = await supabase
    .from('blogs')
    .insert({
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
    .select('id')
    .single()

  if (error) return { error: error.message }

  if (!blog) {
    return { error: 'Blog create hua lekin uski ID nahi mili.' }
  }

  const relationshipError = await saveBlogRelationships(
    supabase,
    blog.id,
    productIds,
    brandIds,
    setupIds
  )

  if (relationshipError) {
    // Incomplete blog ko remove kar dega.
    await supabase.from('blogs').delete().eq('id', blog.id)

    return { error: relationshipError }
  }

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

  const productIds = getSelectedIds(formData, 'product_ids')
  const brandIds = getSelectedIds(formData, 'brand_ids')
  const setupIds = getSelectedIds(formData, 'setup_ids')

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

  const relationshipError = await saveBlogRelationships(
    supabase,
    id,
    productIds,
    brandIds,
    setupIds
  )

  if (relationshipError) {
    return { error: relationshipError }
  }

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
