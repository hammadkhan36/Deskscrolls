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

  const [
    { data: blog },
    { data: categories },
    { data: products },
    { data: brands },
    { data: setups },
    { data: blogProducts },
    { data: blogBrands },
    { data: blogSetups },
  ] = await Promise.all([
    supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .maybeSingle(),

    supabase
      .from('blog_categories')
      .select('id, name')
      .order('name'),

    supabase
      .from('products')
      .select('id, name, short_description')
      .is('deleted_at', null)
      .order('name'),

    supabase
      .from('brands')
      .select('id, name, short_description')
      .is('deleted_at', null)
      .order('name'),

    supabase
      .from('setups')
      .select('id, title, owner_name')
      .is('deleted_at', null)
      .order('title'),

    supabase
      .from('blog_products')
      .select('product_id')
      .eq('blog_id', id),

    supabase
      .from('blog_brands')
      .select('brand_id')
      .eq('blog_id', id),

    supabase
      .from('blog_setups')
      .select('setup_id')
      .eq('blog_id', id),
  ])

  if (!blog) notFound()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Edit Blog
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the article and related content.
          </p>
        </div>

        <Link
          href="/admin/blogs"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <BlogForm
        categories={categories || []}
        products={(products || []).map((product) => ({
          id: product.id,
          label: product.name,
          description: product.short_description,
        }))}
        brands={(brands || []).map((brand) => ({
          id: brand.id,
          label: brand.name,
          description: brand.short_description,
        }))}
        setups={(setups || []).map((setup) => ({
          id: setup.id,
          label: setup.title,
          description: setup.owner_name,
        }))}
        initialData={{
          ...blog,
          product_ids:
            blogProducts?.map((item) => item.product_id) || [],
          brand_ids:
            blogBrands?.map((item) => item.brand_id) || [],
          setup_ids:
            blogSetups?.map((item) => item.setup_id) || [],
        }}
      />
    </div>
  )
}
