import { createServerSupabase } from '@/lib/supabase/server'
import CategoryManager from './CategoryManager'

export default async function BlogCategoriesPage() {
  const supabase = await createServerSupabase()
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Blog Categories</h1>
      <CategoryManager initialCategories={categories || []} />
    </div>
  )
}