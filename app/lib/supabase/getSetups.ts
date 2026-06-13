// lib/supabase/getSetups.ts
import { createClient } from '@/lib/supabase/client'

export async function getPublishedSetups(categorySlug?: string, featuredOnly = false) {
  const supabase = createClient()
  let query = supabase
    .from('setups')
    .select('id, title, slug, owner_name, short_intro, cover_image_url, category_id, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (featuredOnly) {
    query = query.eq('featured', true)
  }

  if (categorySlug && categorySlug !== 'all') {
    // First get the category id from slug
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (category) query = query.eq('category_id', category.id)
  }

  const { data, error } = await query
  return { setups: data, error }
}