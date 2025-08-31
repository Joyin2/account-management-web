'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import FeatureHighlights from '@/components/FeatureHighlights'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import PricingPlans from '@/components/PricingPlans'
import Footer from '@/components/Footer'

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    })
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <Testimonials />
      <PricingPlans />
      <Footer />
    </main>
  )
}