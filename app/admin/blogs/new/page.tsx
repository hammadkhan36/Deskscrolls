import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import BlogForm from './BlogForm'

export default async function NewBlogPage() {
  const supabase = await createServerSupabase()
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Blog</h1>
        <Link href="/admin/blogs" className="text-sm text-gray-500 hover:underline">
          ← Back
        </Link>
      </div>
      <BlogForm categories={categories || []} />
    </div>
  )
}