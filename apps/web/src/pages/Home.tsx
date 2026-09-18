import { Footer } from '../components/Footer'
import { AboutUsSection } from '../components/AboutUsSection'
import { BlogSection } from '../components/BlogSection'
import { ContactSection } from '../components/ContactSection'
import { FeatureBar, WhyUsSection } from '../components/FeatureBar'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Navbar } from '../components/Navbar'
import { ProblemSection } from '../components/ProblemSection'
import { ServicesSection } from '../components/ServicesSection'

export function Home() {
  return (
    <div className="theme-page-solid min-h-screen">
      <Navbar />
      <Hero />
      <FeatureBar />
      <ProblemSection />
      <ServicesSection />
      <HowItWorks />
      <WhyUsSection />
      <AboutUsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
