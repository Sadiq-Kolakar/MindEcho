import { ExamModeSection, FeatureBar, WhyUsSection } from '../components/FeatureBar'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Navbar } from '../components/Navbar'
import { ProblemSection } from '../components/ProblemSection'

export function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureBar />
      <ProblemSection />
      <HowItWorks />
      <WhyUsSection />
      <ExamModeSection />
      <Footer />
    </div>
  )
}
