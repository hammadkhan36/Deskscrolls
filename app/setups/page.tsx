import type { Metadata } from 'next'
import Navbar from './../components/Navbar'
import SubscribeSection from './../components/SubscribeSection'
import AllSetupsSection from './../components/AllSetupsSection'
import Footer from './../components/Footer'

export const metadata: Metadata = {
  title: 'Desk Setups & Workspace Inspiration',
  description:
    'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',

  alternates: {
    canonical: '/setups',
  },

  openGraph: {
    title: 'Desk Setups & Workspace Inspiration',
    description:
      'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
    url: '/setups',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Desk Setups & Workspace Inspiration',
    description:
      'Explore real desk setups and workspace ideas for gaming, productivity, work from home, minimal desks, and creative spaces.',
  },
}

type SetupsPageProps = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function SetupsPage({
  searchParams,
}: SetupsPageProps) {
  const params = await searchParams
  const category = params.category || 'all'

  return (
    <>
      <Navbar />

      <main>
        <SubscribeSection variant="testimonial" />

        <AllSetupsSection categorySlug={category} />
      </main>

      <Footer />
    </>
  )
}
