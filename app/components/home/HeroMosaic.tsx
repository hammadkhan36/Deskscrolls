import Image from 'next/image'
import Link from 'next/link'
import { setupTitle, type HomeSetup } from './types'

function MosaicTile({
  setup,
  large,
  preload,
}: {
  setup: HomeSetup
  large?: boolean
  preload?: boolean
}) {
  return (
    <Link
      href={`/setups/${setup.slug}`}
      className={`group relative block overflow-hidden rounded-2xl bg-primary-light ring-1 ring-border ${
        large ? 'row-span-2 aspect-[3/4] sm:aspect-auto' : 'aspect-[4/3]'
      }`}
    >
      {setup.cover_image_url ? (
        <Image
          src={setup.cover_image_url}
          alt={`${setup.owner_name}'s desk setup`}
          fill
          preload={preload}
          sizes={
            large
              ? '(max-width: 1024px) 60vw, 30vw'
              : '(max-width: 1024px) 40vw, 20vw'
          }
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-brand-accent">
          Photos coming soon
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 pt-16">
        <p
          className={`font-semibold leading-tight text-white ${
            large ? 'text-lg sm:text-xl' : 'text-sm'
          }`}
        >
          {setupTitle(setup)}
        </p>
        <p className="mt-0.5 text-xs text-white/75">by {setup.owner_name}</p>
      </div>
    </Link>
  )
}

export default function HeroMosaic({ setups }: { setups: HomeSetup[] }) {
  if (setups.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface-alt p-8 text-center">
        <div>
          <p className="font-brand text-3xl italic text-brand-accent">
            DeskScroll
          </p>
          <p className="mt-3 text-sm text-text-2">
            The first community setups are on their way.
          </p>
        </div>
      </div>
    )
  }

  const [first, second, third] = setups

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-primary-light via-transparent to-surface-alt blur-2xl"
      />
      <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
        <MosaicTile setup={first} large preload />
        {second ? (
          <MosaicTile setup={second} />
        ) : (
          <div className="aspect-[4/3] rounded-2xl bg-surface-alt ring-1 ring-border" />
        )}
        {third ? (
          <MosaicTile setup={third} />
        ) : (
          <div className="aspect-[4/3] rounded-2xl bg-surface-alt ring-1 ring-border" />
        )}
      </div>
    </div>
  )
}
