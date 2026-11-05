import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createServerSupabase()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      cover_image_url,
      product_type,
      price_text,
      published,
      featured,
      sponsored,
      created_at,
      brand:brands (
        id,
        name,
        slug
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage products, gear and digital resources featured on DeskScroll.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 mb-6 text-sm">
          {error.message}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium">
              No products yet
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Add your first DeskScroll product.
            </p>

            <Link
              href="/admin/products/new"
              className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Add Product
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 shrink-0 rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center">
                    {product.cover_image_url ? (
                      <img
                        src={product.cover_image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {product.name}
                      </p>

                      {product.published ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          Published
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border">
                          Draft
                        </span>
                      )}

                      {product.featured && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Featured
                        </span>
                      )}

                      {product.sponsored && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Sponsored
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mt-1">
                      {product.brand?.[0] && (
  <span>
    {product.brand[0].name}
  </span>
)}

                      {product.brand && (
                        <span>•</span>
                      )}

                      <span className="capitalize">
                        {product.product_type}
                      </span>

                      {product.price_text && (
                        <>
                          <span>•</span>
                          <span>{product.price_text}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      /products/{product.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {product.published && (
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      View
                    </Link>
                  )}

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
