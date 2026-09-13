import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminBlogsPage() {
  const supabase = await createServerSupabase()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, published, created_at, category:categories(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New Blog
        </Link>
      </div>

      <div className="bg-white rounded shadow divide-y">
        {(!blogs || blogs.length === 0) && (
          <p className="p-6 text-gray-500">Koi blog nahi hai abhi.</p>
        )}
        {blogs?.map((b: any) => (
          <div key={b.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{b.title}</p>
              <p className="text-xs text-gray-500">
                /blogs/{b.slug}
                {b.category?.name && ` • ${b.category.name}`}
                {!b.published && ' • Draft'}
              </p>
            </div>
            <Link
              href={`/blogs/${b.slug}`}
              target="_blank"
              className="text-sm text-blue-600 hover:underline"
            >
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}