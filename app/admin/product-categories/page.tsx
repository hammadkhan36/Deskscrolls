// import Link from 'next/link'
// import { createServerSupabase } from '@/lib/supabase/server'

// export default async function ProductCategoriesPage() {
//   const supabase = await createServerSupabase()

//   const { data: categories, error } = await supabase
//     .from('product_categories')
//     .select(`
//       id,
//       name,
//       slug,
//       description,
//       parent_id,
//       published,
//       sort_order,
//       parent:product_categories!product_categories_parent_id_fkey (
//         id,
//         name,
//         slug
//       )
//     `)
//     .order('sort_order', {
//       ascending: true,
//     })
//     .order('name', {
//       ascending: true,
//     })

//   if (error) {
//     console.error(
//       'Failed to load product categories:',
//       error.message
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Product Categories
//           </h1>

//           <p className="text-sm text-gray-500 mt-1">
//             Manage product categories used across
//             DeskScroll.
//           </p>
//         </div>

//         <Link
//           href="/admin/product-categories/new"
//           className="inline-flex items-center justify-center bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
//         >
//           Add Category
//         </Link>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">
//           Failed to load categories: {error.message}
//         </div>
//       )}

//       {/* Empty */}
//       {!error && !categories?.length && (
//         <div className="bg-white border rounded-xl p-10 text-center">
//           <h2 className="font-semibold text-lg">
//             No product categories
//           </h2>

//           <p className="text-sm text-gray-500 mt-2">
//             Create your first product category.
//           </p>
//         </div>
//       )}

//       {/* Categories */}
//       {categories && categories.length > 0 && (
//         <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
//           {/* Desktop Header */}
//           <div className="hidden md:grid grid-cols-[1fr_180px_120px_100px_90px] gap-4 px-5 py-3 bg-gray-50 border-b text-xs font-semibold uppercase tracking-wide text-gray-500">
//             <div>Category</div>
//             <div>Parent</div>
//             <div>Status</div>
//             <div>Order</div>
//             <div />
//           </div>

//           <div className="divide-y">
//             {categories.map((category) => {
//               /*
//                * Supabase may infer this self relation
//                * as an array, so normalize it first.
//                */
//               const parent =
//                 category.parent?.[0] || null

//               return (
//                 <div
//                   key={category.id}
//                   className="grid grid-cols-1 md:grid-cols-[1fr_180px_120px_100px_90px] gap-3 md:gap-4 px-5 py-4 items-center"
//                 >
//                   {/* Category */}
//                   <div className="min-w-0">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <p className="font-medium">
//                         {category.name}
//                       </p>

//                       {!category.parent_id && (
//                         <span className="text-[10px] border rounded-full px-2 py-0.5 text-gray-500">
//                           Top Level
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-xs text-gray-400 mt-1">
//                       /products/category/{category.slug}
//                     </p>

//                     {category.description && (
//                       <p className="text-sm text-gray-500 mt-2 line-clamp-1">
//                         {category.description}
//                       </p>
//                     )}
//                   </div>

//                   {/* Parent */}
//                   <div>
//                     <span className="md:hidden text-xs text-gray-400 mr-2">
//                       Parent:
//                     </span>

//                     <span className="text-sm text-gray-600">
//                       {parent
//                         ? parent.name
//                         : '—'}
//                     </span>
//                   </div>

//                   {/* Status */}
//                   <div>
//                     <span
//                       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                         category.published
//                           ? 'bg-green-50 text-green-700'
//                           : 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {category.published
//                         ? 'Published'
//                         : 'Draft'}
//                     </span>
//                   </div>

//                   {/* Sort Order */}
//                   <div>
//                     <span className="md:hidden text-xs text-gray-400 mr-2">
//                       Order:
//                     </span>

//                     <span className="text-sm">
//                       {category.sort_order ?? 0}
//                     </span>
//                   </div>

//                   {/* Edit */}
//                   <div className="md:text-right">
//                     <Link
//                       href={`/admin/product-categories/${category.id}/edit`}
//                       className="inline-flex border rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50"
//                     >
//                       Edit
//                     </Link>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   )
//                   }






import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

type ProductCategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  published: boolean | null
  sort_order: number | null
}

export default async function ProductCategoriesPage() {
  const supabase =
    await createServerSupabase()

  const { data, error } = await supabase
    .from('product_categories')
    .select(`
      id,
      name,
      slug,
      description,
      parent_id,
      published,
      sort_order
    `)
    .order('sort_order', {
      ascending: true,
    })
    .order('name', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Failed to load product categories:',
      error.message
    )
  }

  const categories =
    (data || []) as ProductCategoryRow[]

  // Resolve parent names locally instead of relying
  // on the Supabase self-relationship schema cache.
  const categoriesById = new Map(
    categories.map((category) => [
      category.id,
      category,
    ])
  )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Product Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage product categories used across
            DeskScroll.
          </p>
        </div>

        <Link
          href="/admin/product-categories/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Category
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Failed to load categories:{' '}
          {error.message}
        </div>
      )}

      {!error && categories.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold">
            No product categories
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your first product category.
          </p>
        </div>
      )}

      {!error && categories.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_180px_120px_100px_90px] gap-4 border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
            <div>Category</div>
            <div>Parent</div>
            <div>Status</div>
            <div>Order</div>
            <div />
          </div>

          <div className="divide-y">
            {categories.map((category) => {
              const parent =
                category.parent_id
                  ? categoriesById.get(
                      category.parent_id
                    ) || null
                  : null

              return (
                <div
                  key={category.id}
                  className="grid grid-cols-1 items-center gap-3 px-4 py-4 sm:px-5 md:grid-cols-[1fr_180px_120px_100px_90px] md:gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words font-medium">
                        {category.name}
                      </p>

                      {!category.parent_id && (
                        <span className="rounded-full border px-2 py-0.5 text-[10px] text-gray-500">
                          Top Level
                        </span>
                      )}
                    </div>

                    <p className="mt-1 break-all text-xs text-gray-400">
                      /products/category/
                      {category.slug}
                    </p>

                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500 md:line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="mr-2 text-xs text-gray-400 md:hidden">
                      Parent:
                    </span>

                    <span className="text-sm text-gray-600">
                      {parent
                        ? parent.name
                        : '—'}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        category.published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.published
                        ? 'Published'
                        : 'Draft'}
                    </span>
                  </div>

                  <div>
                    <span className="mr-2 text-xs text-gray-400 md:hidden">
                      Order:
                    </span>

                    <span className="text-sm">
                      {category.sort_order ??
                        0}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <Link
                      href={`/admin/product-categories/${category.id}/edit`}
                      className="inline-flex min-h-10 items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
