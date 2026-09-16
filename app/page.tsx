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
}import SubscribeSection from './components/SubscribeSection'
import Footer from './components/Footer'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('name, slug')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  return (
    <main className="bg-[#FAFAF7]">
      <Navbar />
      <NewsletterSubscribe />

      {/* Minimal setups spotlight */}
      {/* <FeaturedSection categorySlug="minimal-setups" limit={6} /> */}
      <FeaturedSection categorySlug="all" limit={6} />


      {/* Mid-page subscribe nudge */}
      <SubscribeSection variant="default" />

      {/* All recent setups */}
      <FeaturedSection categorySlug="all" limit={6} />

      {/* Social proof */}
      <SubscribeSection variant="social-proof" />

      {/* Testimonial */}
      {/* <SubscribeSection variant="testimonial" /> */}

      <Footer />
    </main>
  )
}
