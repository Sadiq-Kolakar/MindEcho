import { lazy, Suspense } from 'react'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { SectionFallback } from '../components/ui/page-loader'

const FeatureBar = lazy(() =>
  import('../components/FeatureBar').then((m) => ({ default: m.FeatureBar })),
)
const WhyUsSection = lazy(() =>
  import('../components/FeatureBar').then((m) => ({ default: m.WhyUsSection })),
)
const ProblemSection = lazy(() =>
  import('../components/ProblemSection').then((m) => ({ default: m.ProblemSection })),
)
const ServicesSection = lazy(() =>
  import('../components/ServicesSection').then((m) => ({ default: m.ServicesSection })),
)
const HowItWorks = lazy(() =>
  import('../components/HowItWorks').then((m) => ({ default: m.HowItWorks })),
)
const AboutUsSection = lazy(() =>
  import('../components/AboutUsSection').then((m) => ({ default: m.AboutUsSection })),
)
const BlogSection = lazy(() =>
  import('../components/BlogSection').then((m) => ({ default: m.BlogSection })),
)
const ContactSection = lazy(() =>
  import('../components/ContactSection').then((m) => ({ default: m.ContactSection })),
)

export function Home() {
  return (
    <div className="min-h-screen bg-[#1e1917]">
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionFallback height="180px" />}>
        <FeatureBar />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ProblemSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionFallback height="280px" />}>
        <WhyUsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutUsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback height="360px" />}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ContactSection />
      </Suspense>
      <Footer />
    </div>
  )
}
