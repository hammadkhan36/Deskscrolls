import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import EditBrandForm from './EditBrandForm'

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createServerSupabase()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()

  if (!brand) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/admin/brands"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Brands
          </Link>

          <h1 className="text-2xl font-bold mt-3">
            Edit Brand
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Update {brand.name}.
          </p>
        </div>
      </div>

      <EditBrandForm brand={brand} />
    </div>
  )
}
