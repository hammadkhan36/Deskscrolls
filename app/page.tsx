import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import NewsletterSubscribe from './components/NewsletterSubscribe'
import FeaturedSection from './components/FeaturedSection'
import SubscribeSection from './components/SubscribeSection'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'DeskScroll — Desk Setups, Workspace Gear & Inspiration',
  description:
    'Discover desk setups, workspace inspiration, products, brands and ideas for building a better workspace.',
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <NewsletterSubscribe />

        <FeaturedSection
          categorySlug="all"
          limit={6}
        />

        <SubscribeSection variant="default" />

        <SubscribeSection variant="social-proof" />
      </main>

      <Footer />
    </>
  )
}
