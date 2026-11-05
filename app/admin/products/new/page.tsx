import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import ProductForm from './ProductForm'

export default async function NewProductPage() {
  const supabase = await createServerSupabase()

  const [
    { data: brands, error: brandsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name')
      .is('deleted_at', null)
      .order('name'),

    supabase
      .from('product_categories')
      .select('id, name, parent_id, sort_order')
      .eq('published', true)
      .order('sort_order')
      .order('name'),
  ])

  const loadError =
    brandsError?.message ||
    categoriesError?.message

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Products
        </Link>

        <h1 className="text-2xl font-bold mt-3">
          Add Product
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Create a product, piece of gear, or digital resource for DeskScroll.
        </p>
      </div>

      {loadError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Failed to load product form: {loadError}
        </div>
      ) : (
        <ProductForm
          brands={brands || []}
          categories={categories || []}
        />
      )}
    </div>
  )
}
