import Link from 'next/link'

export type CategoryChip = {
  id: string
  name: string
  slug: string
  count: number
}

export default function CategoryChips({
  categories,
  totalCount,
}: {
  categories: CategoryChip[]
  totalCount: number
}) {
  if (categories.length === 0) return null

  const chipBase =
    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
      <ul className="flex gap-2.5 sm:flex-wrap">
        <li>
          <Link
            href="/setups"
            className={`${chipBase} border-text-1 bg-text-1 text-white hover:bg-[#383838]`}
          >
            All setups
            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold">
              {totalCount}
            </span>
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/${category.slug}`}
              className={`${chipBase} border-border bg-surface text-text-1 hover:border-primary hover:text-primary-dark`}
            >
              {category.name}
              <span className="rounded-full bg-surface-alt px-1.5 py-0.5 text-[11px] font-semibold text-text-2">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
