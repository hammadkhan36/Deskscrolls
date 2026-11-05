import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import ProductForm from '@/admin/products/new/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const [
    { data: product, error: productError },
    { data: brands, error: brandsError },
    { data: categories, error: categoriesError },
    { data: categoryLinks, error: linksError },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        brand_id,
        short_description,
        content,
        cover_image_url,
        product_type,
        price_text,
        buy_url,
        cta_text,
        meta_title,
        meta_description,
        published,
        featured,
        sponsored
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle(),

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

    supabase
      .from('product_category_links')
      .select('category_id, is_primary')
      .eq('product_id', id),
  ])

  if (productError) {
    throw new Error(productError.message)
  }

  if (!product) {
    notFound()
  }

  const loadError =
    brandsError?.message ||
    categoriesError?.message ||
    linksError?.message

  const categoryIds =
    categoryLinks?.map(
      (link) => link.category_id
    ) || []

  const primaryCategoryId =
    categoryLinks?.find(
      (link) => link.is_primary
    )?.category_id || null

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
          Edit Product
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Update {product.name}.
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
          initialData={{
            ...product,
            category_ids: categoryIds,
            primary_category_id:
              primaryCategoryId,
          }}
        />
      )}
    </div>
  )
}
