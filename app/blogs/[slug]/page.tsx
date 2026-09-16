



import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: blog, error } = await supabase
    .from('blogs')
    .select(`
      *,
      category:blog_categories(id, name, slug),
      author:profiles(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .single()

  if (error || !blog) notFound()

  const { data: related } = await supabase
    .from('blogs')
    .select('id, slug, title, short_intro, cover_image_url')
    .eq('published', true)
    .is('deleted_at', null)
    .eq('category_id', blog.category_id)
    .neq('id', blog.id)
    .limit(3)
    .order('published_at', { ascending: false })

  const readingTime = Math.max(
    1,
    Math.ceil((blog.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 200)
  )

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen bg-[#FAFAF7] pt-8 pb-16"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blogs">Blogs</Link>
            {blog.category && (
              <>
                <span>/</span>
                <Link href={`/blogs?category=${blog.category.slug}`}>
                  {blog.category.name}
                </Link>
              </>
            )}
          </nav>

          {/* Category badge */}
          {blog.category && (
            <Link
              href={`/blogs?category=${blog.category.slug}`}
              className="inline-block text-xs font-semibold uppercase tracking-wider text-[#D97742] hover:text-[#B85C2E] transition-colors bg-white px-2.5 py-1 rounded-full border border-[#E6E1D8] mb-4"
            >
              {blog.category.name}
            </Link>
          )}

          {/* Title block */}
          <div className="mb-8 pb-6 border-b border-[#E6E1D8]">
            <h1 className="text-3xl sm:text-[40px] font-bold text-[#1E1E1E] leading-tight mb-3">
              {blog.title}
            </h1>
            {blog.short_intro && (
              <p className="text-[#6B6B6B] text-[17px] leading-relaxed mb-4">
                {blog.short_intro}
              </p>
            )}

            <div className="flex items-center gap-3 text-[13px] text-[#6B6B6B]">
              <div className="w-8 h-8 rounded-full bg-[#F5E6D3] flex items-center justify-center font-semibold text-[#D97742] text-xs">
                {(blog.author?.full_name?.[0] || 'D').toUpperCase()}
              </div>
              <span className="font-medium text-[#1E1E1E]">
                {blog.author?.full_name || 'Deskscrolls Team'}
              </span>
              <span>•</span>
              <span>
                {blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })
                  : 'Draft'}
              </span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Cover image */}
          {blog.cover_image_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-10 border border-[#E6E1D8]">
              <Image
                src={blog.cover_image_url}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {/* Content card */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 sm:p-10 mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            {blog.content && (
              <div
                className="prose prose-neutral max-w-none text-[#1E1E1E]
                  prose-headings:font-bold prose-headings:text-[#1E1E1E]
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-[#3D3D3D] prose-p:leading-relaxed
                  prose-a:text-[#D97742] hover:prose-a:text-[#B85C2E] prose-a:no-underline prose-a:font-medium
                  prose-strong:text-[#1E1E1E]
                  prose-blockquote:border-l-4 prose-blockquote:border-[#D97742] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#6B6B6B] prose-blockquote:my-6
                  prose-img:rounded-xl prose-img:my-8
                  prose-code:bg-[#F5EDE4] prose-code:text-[#B85C2E] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-[#1E1E1E] prose-pre:rounded-xl prose-pre:p-4
                  prose-ul:my-6 prose-ol:my-6 prose-li:my-1 prose-li:text-[#3D3D3D]
                  prose-hr:border-[#E6E1D8]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </div>

          {/* Share nudge */}
          <div className="bg-[#F5EDE4] border border-[#E6E1D8] rounded-xl p-6 text-center mb-6">
            <p className="text-[#1E1E1E] font-medium mb-1">
              Found this useful? Share it with a friend. ❤️
            </p>
            <p className="text-[#6B6B6B] text-sm">
              Questions or collabs?{' '}
              <a href="mailto:hello@deskscrolls.com" className="text-[#D97742] hover:text-[#B85C2E] transition-colors underline underline-offset-2">
                hello@deskscrolls.com
              </a>
            </p>
          </div>

          {/* Subscribe */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 text-center flex flex-col items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#BF6F4A]">
              Never miss a story
            </p>
            <p className="text-[#1E1E1E] font-medium">
              Get one new article delivered every Saturday.
            </p>
            <form className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-[#E6E1D8] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#6B6B6B] focus:border-[#D97742] focus:outline-none focus:ring-1 focus:ring-[#D97742] transition"
              />
              <button className="rounded-md bg-[#D97742] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B85C2E] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="bg-white border-t border-[#E6E1D8] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-1">Related Articles</h2>
              <p className="text-[#6B6B6B] text-sm">More stories from the same category.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link key={r.id} href={`/blogs/${r.slug}`} className="group block">
                  <div className="bg-[#FAFAF7] rounded-xl overflow-hidden border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200">
                    <div className="relative aspect-[4/3] w-full bg-[#F5E6D3]">
                      {r.cover_image_url ? (
                        <Image
                          src={r.cover_image_url}
                          alt={r.title}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#6B6B6B] text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                        {r.short_intro}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
