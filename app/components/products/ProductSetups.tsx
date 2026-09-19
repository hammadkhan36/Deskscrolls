import Image from "next/image";
import Link from "next/link";

export type ProductSetup = {
  id: string;
  title: string;
  slug: string;
  owner_name: string;
  short_intro: string | null;
  cover_image_url: string | null;
};

type ProductSetupsProps = {
  setups: ProductSetup[];
};

export default function ProductSetups({ setups }: ProductSetupsProps) {
  if (setups.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl border-t border-neutral-200 px-4 pt-12 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            See it in action
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Setups using this product
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Explore real desk setups featuring this product.
          </p>
        </div>

        <Link
          href="/setups"
          className="hidden shrink-0 text-sm font-medium text-neutral-600 transition hover:text-neutral-950 sm:inline-flex"
        >
          View all setups
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {setups.map((setup) => (
          <Link
            key={setup.id}
            href={`/setups/${setup.slug}`}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              {setup.cover_image_url ? (
                <Image
                  src={setup.cover_image_url}
                  alt={setup.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  No setup image
                </div>
              )}
            </div>

            <div className="p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Setup by {setup.owner_name}
              </p>

              <h3 className="text-lg font-semibold leading-snug text-neutral-950">
                {setup.title}
              </h3>

              {setup.short_intro && (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                  {setup.short_intro}
                </p>
              )}

              <span className="mt-4 inline-flex text-sm font-semibold text-neutral-950">
                View setup →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/setups"
        className="mt-6 inline-flex text-sm font-medium text-neutral-700 sm:hidden"
      >
        View all setups →
      </Link>
    </section>
  );
}
