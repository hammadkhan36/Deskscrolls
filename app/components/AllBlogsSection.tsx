'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

type Blog = {
  id: string
  slug: string
  title: string
  short_intro: string | null
  cover_image_url: string | null
  category: { name: string; slug: string } | null
}

const LIMIT = 9

export default function AllBlogsSection({ categorySlug = 'all' }: { categorySlug?: string }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const supabase = createClient()

  const fetchBlogs = useCallback(
    async (from = 0, append = false) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(false)

      try {
        let query = supabase
          .from('blogs')
          .select('id, slug, title, short_intro, cover_image_url, category:blog_categories(name, slug)')
          .eq('published', true)
          .is('deleted_at', null)
          .order('published_at', { ascending: false })
          .range(from, from + LIMIT - 1)

        if (categorySlug && categorySlug !== 'all') {
          const { data: category } = await supabase
            .from('blog_categories').select('id').eq('slug', categorySlug).single()
          if (category) {
            query = query.eq('category_id', category.id)
          } else {
            setBlogs(append ? blogs : [])
            setHasMore(false)
            return
          }
        }

        const { data, error } = await query
        if (error) throw error

        const normalizedData: Blog[] = (data || []).map((blog) => ({
          ...blog,
          category: Array.isArray(blog.category) ? blog.category[0] || null : blog.category,
        }))

        if (append) setBlogs((prev) => [...prev, ...normalizedData])
        else setBlogs(normalizedData)

        setHasMore(normalizedData.length === LIMIT)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [categorySlug, blogs]
  )

  useEffect(() => { fetchBlogs(0, false) }, [categorySlug])

  return (
    <section className="bg-[#FAFAF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#1E1E1E]">
            Stories & guides
          </h2>
          <p className="text-[#6B6B6B] text-sm mt-1">Ideas, tutorials aur workspace inspiration.</p>
        </div>

        {/* Loading skeleton */}
        {loading && !loadingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#E6E1D8] animate-pulse">
                <div className="aspect-[4/3] bg-[#E6E1D8]" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-[#E6E1D8] rounded w-3/4" />
                  <div className="h-4 bg-[#E6E1D8] rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center py-12 text-red-500">Failed to load blogs.</p>}

        {!loading && !error && blogs.length === 0 && (
          <p className="text-center py-12 text-[#6B6B6B]">No blogs found in this category.</p>
        )}

        {/* Grid */}
        {blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200">
                  <div className="relative aspect-[4/3] w-full bg-[#F5E6D3]">
                    {blog.cover_image_url ? (
                      <Image
                        src={blog.cover_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B6B6B] text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {blog.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D97742]">
                        {blog.category.name}
                      </span>
                    )}
                    <h3 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors mt-1">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-[#6B6B6B] mt-1 leading-snug line-clamp-2">
                      {blog.short_intro || ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => fetchBlogs(blogs.length, true)}
              disabled={loadingMore}
              className="bg-[#D97742] hover:bg-[#B85C2E] text-white font-semibold px-8 py-3 rounded-md transition-colors disabled:opacity-50 text-sm"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}