import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BlogForm from '@/admin/blogs/new/BlogForm'

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!blog) notFound()

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <Link
          href="/admin/blogs"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back
        </Link>
      </div>
      <BlogForm categories={categories || []} initialData={blog} />
    </div>
  )
}