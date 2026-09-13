// import { createServerSupabase } from '@/lib/supabase/server'
// import Link from 'next/link'

// export default async function BlogsPage() {
//   const supabase = await createServerSupabase()
//   const { data: blogs } = await supabase
//     .from('blogs')
//     .select('id, title, slug, short_intro, cover_image_url, published_at')
//     .eq('published', true)
//     .is('deleted_at', null)
//     .order('published_at', { ascending: false })

//   return (
//     <div className="max-w-5xl mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold mb-8">Blogs</h1>
//       <div className="grid gap-6 md:grid-cols-2">
//         {blogs?.map((b) => (
//           <Link
//             key={b.id}
//             href={`/blogs/${b.slug}`}
//             className="block bg-white rounded-xl shadow hover:shadow-md overflow-hidden"
//           >
//             {b.cover_image_url && (
//               <img src={b.cover_image_url} alt={b.title} className="w-full h-48 object-cover" />
//             )}
//             <div className="p-4">
//               <h2 className="font-bold text-lg mb-1">{b.title}</h2>
//               {b.short_intro && <p className="text-sm text-gray-600">{b.short_intro}</p>}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }










import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function BlogsPage() {
  const supabase = await createServerSupabase()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, short_intro, cover_image_url, published_at, category:blog_categories(name, slug)')
    .eq('published', true)
    .is('deleted_at', null)
    .order('published_at', { ascending: false })

  const featured = blogs?.[0]
  const rest = blogs?.slice(1) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            The Deskscrolls Journal
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-4 mb-4">
            Stories, guides & ideas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Workspace inspiration, productivity tips aur setup reviews — sab ek jagah.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Featured Blog */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group block mb-20"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100">
                {featured.cover_image_url && (
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div>
                <span className="inline-block text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Featured
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-gray-700 transition">
                  {featured.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                  {featured.short_intro}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {featured.category && (
                    <>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {featured.category[0]?.name}
                      </span>
                    </>
                  )}
                  <span>
                    {featured.published_at &&
                      new Date(featured.published_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <>
            <h3 className="text-2xl font-bold mb-8">Latest articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {b.cover_image_url && (
                      <img
                        src={b.cover_image_url}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    {b.category && (
                      <span className="font-medium uppercase tracking-wider">
                        {b.category[0]?.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition line-clamp-2">
                    {b.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{b.short_intro}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        {blogs?.length === 0 && (
          <p className="text-center text-gray-500 py-20">Koi blog nahi hai abhi.</p>
        )}
      </div>
    </div>
  )
}