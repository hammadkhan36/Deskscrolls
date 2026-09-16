import Navbar from './components/Navbar'
import NewsletterSubscribe from './components/NewsletterSubscribe'
import FeaturedSection from './components/FeaturedSection'
import SubscribeSection from './components/SubscribeSection'
import Footer from './components/Footer'

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
