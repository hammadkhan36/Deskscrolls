// import { createServerSupabase } from '@/lib/supabase/server'
// import { notFound } from 'next/navigation'

// export default async function BlogPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params
//   const supabase = await createServerSupabase()

//   const { data: blog } = await supabase
//     .from('blogs')
//     .select('*, category:categories(name)')
//     .eq('slug', slug)
//     .eq('published', true)
//     .is('deleted_at', null)
//     .maybeSingle()

//   if (!blog) notFound()

//   return (
//     <article className="max-w-3xl mx-auto py-12 px-4">
//       {blog.cover_image_url && (
//         <img
//           src={blog.cover_image_url}
//           alt={blog.title}
//           className="w-full h-64 object-cover rounded-2xl mb-8"
//         />
//       )}

//       <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
//       <p className="text-gray-500 mb-8">
//         {blog.published_at && new Date(blog.published_at).toLocaleDateString()}
//         {blog.category?.name && ` • ${blog.category.name}`}
//       </p>

//       <div
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />
//     </article>
//   )
// }






import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*, category:blog_categories(name, slug)')
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (!blog) notFound()

  // Related posts
  const { data: related } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image_url, published_at')
    .eq('published', true)
    .is('deleted_at', null)
    .neq('id', blog.id)
    .limit(3)

  const readingTime = Math.max(
    1,
    Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)
  )

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <Link
          href="/blogs"
          className="text-sm text-gray-500 hover:text-black mb-8 inline-flex items-center gap-2"
        >
          ← Back to all articles
        </Link>

        {blog.category && (
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              {blog.category.name}
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
          {blog.title}
        </h1>

        {blog.short_intro && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {blog.short_intro}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 pb-8 border-b">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
            {(blog.author_id?.[0] || 'A').toUpperCase()}
          </div>
          <div>
            <p className="text-gray-900 font-medium">Deskscrolls Team</p>
            <p>
              {blog.published_at &&
                new Date(blog.published_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              {' • '}
              {readingTime} min read
            </p>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.cover_image_url && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-black prose-a:underline prose-a:font-medium
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
            prose-img:rounded-2xl prose-img:my-8
            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:p-4
            prose-ul:my-6 prose-ol:my-6 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="border-t bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold mb-8">Keep reading</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blogs/${r.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 mb-4">
                    {r.cover_image_url && (
                      <img
                        src={r.cover_image_url}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h3 className="font-bold group-hover:text-gray-700 transition line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}