import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*, category:categories(name)')
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (!blog) notFound()

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {blog.cover_image_url && (
        <img
          src={blog.cover_image_url}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-2xl mb-8"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-8">
        {blog.published_at && new Date(blog.published_at).toLocaleDateString()}
        {blog.category?.name && ` • ${blog.category.name}`}
      </p>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  )
}