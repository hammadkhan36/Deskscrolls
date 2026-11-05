import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import ProductCategoryForm from './ProductCategoryForm'

export default async function NewProductCategoryPage() {
  const supabase = await createServerSupabase()

  const { data: categories, error } = await supabase
    .from('product_categories')
    .select('id, name')
    .order('sort_order')
    .order('name')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/product-categories"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Product Categories
        </Link>

        <h1 className="text-2xl font-bold mt-3">
          Add Product Category
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Create a category for DeskScroll products.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Failed to load categories: {error.message}
        </div>
      ) : (
        <ProductCategoryForm
          categories={categories || []}
        />
      )}
    </div>
  )
}
