import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import BlogForm from './BlogForm'

export default async function NewBlogPage() {
  const supabase = await createServerSupabase()

  const [
    { data: categories },
    { data: products },
    { data: brands },
    { data: setups },
  ] = await Promise.all([
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
  ])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            New Blog
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create an article and connect related content.
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
      />
    </div>
  )
}
