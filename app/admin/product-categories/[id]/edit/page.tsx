import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import EditProductCategoryForm from './EditProductCategoryForm'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductCategoryPage({
  params,
}: PageProps) {
  const { id } = await params

  const supabase = await createServerSupabase()

  const [
    { data: category, error: categoryError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from('product_categories')
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        meta_title,
        meta_description,
        published,
        sort_order
      `)
      .eq('id', id)
      .maybeSingle(),

    supabase
      .from('product_categories')
      .select('id, name')
      .neq('id', id)
      .order('sort_order')
      .order('name'),
  ])

  if (categoryError) {
    throw new Error(categoryError.message)
  }

  if (!category) {
    notFound()
  }

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
          Edit Product Category
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Update {category.name}.
        </p>
      </div>

      {categoriesError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Failed to load parent categories:{' '}
          {categoriesError.message}
        </div>
      ) : (
        <EditProductCategoryForm
          category={category}
          categories={categories || []}
        />
      )}
    </div>
  )
}
