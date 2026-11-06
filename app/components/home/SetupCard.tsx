import Image from 'next/image'
import Link from 'next/link'
import { ownerInitial, setupTitle, type HomeSetup } from './types'

type SetupCardProps = {
  setup: HomeSetup
  /** Larger editorial card used for featured setups. */
  variant?: 'default' | 'featured'
  sizes?: string
}

export default function SetupCard({
  setup,
  variant = 'default',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: SetupCardProps) {
  const title = setupTitle(setup)
  const isFeatured = variant === 'featured'

  return (
    <article className="group h-full">
      <Link
        href={`/setups/${setup.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_45px_rgba(30,30,30,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div
          className={`relative w-full overflow-hidden bg-primary-light ${
            isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          {setup.cover_image_url ? (
            <Image
              src={setup.cover_image_url}
              alt={`${setup.owner_name}'s desk setup`}
              fill
              sizes={sizes}
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-brand-accent">
              Photos coming soon
            </div>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2">
            {isFeatured && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                Featured
              </span>
            )}
            {setup.primary_category && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-1 shadow-sm backdrop-blur">
                {setup.primary_category.name}
              </span>
            )}
          </div>
        </div>

        <div className={`flex flex-1 flex-col ${isFeatured ? 'p-6' : 'p-5'}`}>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark"
            >
              {ownerInitial(setup.owner_name)}
            </span>
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-text-2">
              Setup by {setup.owner_name}
            </p>
          </div>

          <h3
            className={`mt-3 font-semibold leading-snug text-text-1 ${
              isFeatured ? 'text-2xl' : 'line-clamp-2 text-lg'
            }`}
          >
            {title}
          </h3>

          {setup.short_intro && (
            <p
              className={`mt-2 text-sm leading-6 text-text-2 ${
                isFeatured ? 'line-clamp-3' : 'line-clamp-2'
              }`}
            >
              {setup.short_intro}
            </p>
          )}

          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-dark transition-colors group-hover:text-primary">
            View setup
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}
