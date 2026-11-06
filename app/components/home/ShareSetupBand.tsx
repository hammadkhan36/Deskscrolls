import Link from 'next/link'

const steps = [
  {
    step: '01',
    title: 'Photograph your desk',
    text: 'Five or more clear photos of your workspace, in daylight if you can.',
  },
  {
    step: '02',
    title: 'Tell us the story',
    text: 'Your gear list, what you love about the space and what you would change.',
  },
  {
    step: '03',
    title: 'Get featured',
    text: 'We review every submission by hand and publish the best ones here.',
  },
]

export default function ShareSetupBand() {
  return (
    <section
      aria-labelledby="share-heading"
      className="relative overflow-hidden bg-text-1 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-accent/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-light/80">
              Join the community
            </p>
            <h2
              id="share-heading"
              className="mt-3 text-balance text-3xl font-bold tracking-[-0.8px] sm:text-4xl"
            >
              Built a workspace you&rsquo;re proud of?
              <span className="block font-brand text-primary-light/90 italic">
                Show it to the world.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/70">
              Every setup on DeskScroll comes from a real person. Submit yours,
              get hand-reviewed, and inspire the next desk.
            </p>
            <Link
              href="/submit"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-text-1"
            >
              Submit your desk setup
            </Link>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <span className="font-brand text-2xl italic text-primary-light">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
