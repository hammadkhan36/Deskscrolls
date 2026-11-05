import Image from "next/image";
import Link from "next/link";

export type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  cover_image_url: string | null;
  price_text: string | null;
};

export type RelatedBrand = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  logo_url: string | null;
};

export type RelatedSetup = {
  id: string;
  title: string;
  slug: string;
  owner_name: string;
  short_intro: string | null;
  cover_image_url: string | null;
};

type BlogRelatedContentProps = {
  products: RelatedProduct[];
  brands: RelatedBrand[];
  setups: RelatedSetup[];
};

export default function BlogRelatedContent({
  products,
  brands,
  setups,
}: BlogRelatedContentProps) {
  if (
    products.length === 0 &&
    brands.length === 0 &&
    setups.length === 0
  ) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl border-t border-neutral-200 px-4 pt-12 sm:px-6 lg:px-8">
      {products.length > 0 && (
        <div className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Featured gear
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Related Products
              </h2>
            </div>

            <Link
              href="/products"
              className="shrink-0 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {product.cover_image_url ? (
                    <Image
                      src={product.cover_image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                      No product image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-neutral-950">
                      {product.name}
                    </h3>

                    {product.price_text && (
                      <span className="shrink-0 text-sm font-medium text-neutral-600">
                        {product.price_text}
                      </span>
                    )}
                  </div>

                  {product.short_description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                      {product.short_description}
                    </p>
                  )}

                  <span className="mt-4 inline-flex text-sm font-semibold text-neutral-950">
                    View product →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Explore makers
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Related Brands
              </h2>
            </div>

            <Link
              href="/brands"
              className="shrink-0 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group flex min-h-44 flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-28 items-center justify-start">
                  {brand.logo_url ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={brand.logo_url}
                        alt={`${brand.name} logo`}
                        fill
                        sizes="112px"
                        className="object-contain object-left"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-lg font-semibold text-white">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-neutral-950">
                  {brand.name}
                </h3>

                {brand.short_description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {brand.short_description}
                  </p>
                )}

                <span className="mt-auto pt-4 text-sm font-semibold text-neutral-950">
                  Explore brand →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {setups.length > 0 && (
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Workspace inspiration
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Related Setups
              </h2>
            </div>

            <Link
              href="/setups"
              className="shrink-0 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {setups.map((setup) => (
              <Link
                key={setup.id}
                href={`/setups/${setup.slug}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
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

                  <h3 className="text-lg font-semibold text-neutral-950">
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
        </div>
      )}
    </section>
  );
}
