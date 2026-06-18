// app/admin/posts/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import AdminPostsTable from './AdminPostsTable'
import Link from 'next/link'

// This page will display posts with filters
export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: { status?: string; author?: string }
}) {
  const supabase = await createServerSupabase()
  const status = searchParams.status || 'all' // all, published, draft, deleted
  const authorId = searchParams.author || ''

  // Base query
  let query = supabase.from('setups').select(`
    id, title, slug, owner_name, published, deleted_at, created_at, updated_at,
    author:profiles(full_name, id),
    categories:setup_categories(category:categories(name))
  `)

  // Apply filters
  if (status === 'published') {
    query = query.eq('published', true).is('deleted_at', null)
  } else if (status === 'draft') {
    query = query.eq('published', false).is('deleted_at', null)
  } else if (status === 'deleted') {
    query = query.not('deleted_at', 'is', null)
  } else {
    // 'all' shows everything except deleted (or include deleted if admin wants)
    // For simplicity, 'all' shows active (published + draft)
    query = query.is('deleted_at', null)
  }

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  const { data: rawSetups } = await query.order('created_at', { ascending: false })

  const setups = rawSetups?.map((setup: any) => ({
    ...setup,
    author: Array.isArray(setup.author) ? setup.author[0] : setup.author,
  })) ?? []

  // Fetch authors for filter dropdown
  const { data: authors } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            defaultValue={status}
            onChange={(e) => {
              const url = new URL(window.location.href)
              url.searchParams.set('status', e.target.value)
              window.location.href = url.toString()
            }}
            className="border rounded px-3 py-1"
          >
            <option value="all">All Active</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="deleted">Trash</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <select
            defaultValue={authorId}
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) url.searchParams.set('author', e.target.value)
              else url.searchParams.delete('author')
              window.location.href = url.toString()
            }}
            className="border rounded px-3 py-1"
          >
            <option value="">All Authors</option>
            {authors?.map(a => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      {setups && setups.length > 0 ? (
        <AdminPostsTable setups={setups} status={status} />
      ) : (
        <div className="text-center py-12 text-gray-500">No posts found.</div>
      )}
    </div>
  )
}