'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/services/HeroSection'
import ServiceOverview from '@/components/services/ServiceOverview'
import FeatureDetails from '@/components/services/FeatureDetails'
import IntegrationPartners from '@/components/services/IntegrationPartners'
import PricingComparison from '@/components/services/PricingComparison'
import TechnicalSpecs from '@/components/services/TechnicalSpecs'
import FAQ from '@/components/services/FAQ'

export default function ServicesPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    })
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ServiceOverview />
      <FeatureDetails />
      <IntegrationPartners />
      <PricingComparison />
      <TechnicalSpecs />
      <FAQ />
      <Footer />
    </main>
  )
}