import Link from 'next/link'
import BrandForm from './BrandForm'

export default function NewBrandPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/brands"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Brands
        </Link>

        <h1 className="text-2xl font-bold mt-3">
          Add Brand
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Create a brand for products featured on DeskScroll.
        </p>
      </div>

      <BrandForm />
    </div>
  )
}
