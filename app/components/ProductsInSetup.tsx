import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import SetupProductImage from '@/components/SetupProductImage'

export type PublicSetupProduct = {
  sort_order: number | null
  notes: string | null
  product: {
    id: string
    name: string
    slug: string
    short_description: string | null
    cover_image_url: string | null
    price_text: string | null
    sponsored: boolean | null
  }
}

export function SetupProductCards({ items }: { items: PublicSetupProduct[] }) {
  if (!items.length) return null
  return (
    <section className="mb-10" aria-labelledby="products-in-setup-heading">
      <h2 id="products-in-setup-heading" className="mb-4 text-2xl font-bold text-[#1E1E1E]">Products in this Setup</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(({ product, notes }) => (
          <article key={product.id} className="group min-w-0 overflow-hidden rounded-xl border border-[#E6E1D8] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <Link href={`/products/${product.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D97742]">
              <div className="relative aspect-[4/3] bg-[#F5EDE4]">
                <SetupProductImage src={product.cover_image_url} name={product.name} />
              </div>
              <div className="p-4">
                {product.sponsored && <span className="mb-2 inline-block rounded-full border px-2 py-0.5 text-xs text-[#6B6B6B]">Sponsored</span>}
                <h3 className="break-words text-base font-semibold text-[#1E1E1E] group-hover:text-[#D97742]">{product.name}</h3>
                {product.short_description && <p className="mt-2 line-clamp-2 text-sm text-[#6B6B6B]">{product.short_description}</p>}
                {notes && <p className="mt-2 text-sm text-[#6B6B6B] break-words">{notes}</p>}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                  {product.price_text && <span className="font-semibold text-[#1E1E1E]">{product.price_text}</span>}
                  <span className="font-medium text-[#D97742]">View details →</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default async function ProductsInSetup({ setupId }: { setupId: string }) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('setup_products')
    .select(`sort_order, notes, product:products!inner(
      id, name, slug, short_description, cover_image_url, price_text, sponsored
    )`)
    .eq('setup_id', setupId)
    .eq('product.published', true)
    .is('product.deleted_at', null)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('product_id')
    .returns<PublicSetupProduct[]>()
  if (error) {
    console.error('Could not load products for setup', { setupId, code: error.code })
    return <p className="mb-10 text-sm text-[#6B6B6B]">Products for this setup are temporarily unavailable.</p>
  }
  return <SetupProductCards items={data || []} />
}
