import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params
  const supabase = await createServerSupabase()

  // 1. Category exist karti hai?
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', categorySlug)
    .single()

  if (catError || !category) {
    notFound()
  }

  // 2. Setups fetch karo jo is category se linked hain (many‑to‑many)
  const { data: setups } = await supabase
    .from('setups')
    .select(
      'id, slug, owner_name, short_intro, cover_image_url, setup_categories!inner(category_id)'
    )
    .eq('setup_categories.category_id', category.id)
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAF7] pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#6B6B6B] mb-6">
            <Link href="/" className="hover:text-[#D97742] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/setups" className="hover:text-[#D97742] transition-colors">
              Setups
            </Link>
            <span>/</span>
            <span className="text-[#D97742] font-medium">{category.name}</span>
          </nav>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E]">
              {category.name}
            </h1>
            <p className="text-[#6B6B6B] mt-2">
              Browse all desk setups in {category.name.toLowerCase()}.
            </p>
          </div>

          {/* Grid */}
          {setups && setups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {setups.map((setup: any) => (
                <Link
                  key={setup.id}
                  href={`/setups/${setup.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl border border-[#E6E1D8] hover:border-[#D97742]/40 hover:shadow-lg transition-all overflow-hidden">
                    <div className="relative aspect-[4/3] bg-[#F5E6D3]">
                      {setup.cover_image_url ? (
                        <Image
                          src={setup.cover_image_url}
                          alt={setup.owner_name}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#6B6B6B] text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-[15px] font-semibold text-[#1E1E1E] group-hover:text-[#D97742] transition-colors">
                        {setup.owner_name}&apos;s Desk
                      </h2>
                      {setup.short_intro && (
                        <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                          {setup.short_intro}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#6B6B6B]">
              <p>No setups found in this category.</p>
              <Link
                href="/setups"
                className="text-[#D97742] hover:underline mt-2 inline-block"
              >
                View all setups
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}